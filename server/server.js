import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import md5 from 'md5';
// import { v4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// compute __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}



const app = express();

// Use CORS to allow cross-origin requests
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// For parsing application/json
app.use(express.json());

// Cookies
app.use(cookieParser());

// uploading images
// 1. Destination folder (create /uploads at project root)
// 2. Unique filename to avoid collisions
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

// Serve uploaded files statically under /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// 


//connecting to DB

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crowdfunding',
  decimalNumbers: true,
});

con.connect((err) => {
    if (err) {
      console.error('MySQL connection error:', err);
      process.exit(1);
    }
    console.log('Connected to crowdfunding DB!');
  });


  // POST endpoint for user registration
app.post('/api/register', (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Hash the password before storing it
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
  
    const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    con.execute(sql, [name, email, hashedPassword, role || 'author'], (err, results) => {
      if (err) {
        console.error('Error registering user:', err);
        return res.status(500).json({ error: 'Error registering user' });
      }
      // Return the new user's id and basic info
      res.json({ id: results.insertId, name, email, role: role || 'author' });
    });
  });


// POST endpoint for user login
app.post('/api/login', (req, res) => {
  console.log('✅  Got login request:', req.body);

  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Missing credentials' });

  const sql = 'SELECT * FROM users WHERE email = ?';
  con.execute(sql, [email], (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0)
      return res.status(401).json({ error: 'Invalid credentials' });

    const user = results[0];
    if (!bcrypt.compareSync(password, user.password))
      return res.status(401).json({ error: 'Invalid credentials' });

    // Generate a token (ensure you replace 'your_jwt_secret' with a secure secret)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      'your_jwt_secret',
      { expiresIn: '1d' }
    );

    res.json({ token, id: user.id, name: user.name, email: user.email, role: user.role });
  });
});




// app.get('/api/my-stories', authenticateToken, (req, res) => {
//   const sql = `
//     SELECT
//       s.*,
//       u.name               AS author_name,
//       COALESCE(SUM(d.amount), 0) AS collected_amount,
//       COUNT(d.id)          AS donation_count,
//       s.status
//     FROM stories AS s
//     JOIN users    AS u ON u.id = s.author_id
//     LEFT JOIN donations AS d ON d.story_id = s.id
//     WHERE s.author_id = ?
//     GROUP BY s.id
//     ORDER BY s.created_at DESC
//   `;
//   con.execute(sql, [req.user.id], (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'DB error' });
//     }
//     res.json({ stories: results });
//   });
// });

app.get('/api/my-stories', authenticateToken, (req, res) => {
  const storiesSql = `
    SELECT
      s.*,
      u.name AS author_name,
      COALESCE(SUM(d.amount), 0) AS collected_amount,
      s.status,
      s.created_at
    FROM stories AS s
    JOIN users AS u ON u.id = s.author_id
    LEFT JOIN donations AS d ON d.story_id = s.id
    WHERE s.author_id = ?
    GROUP BY s.id
    ORDER BY s.created_at DESC
  `;
  con.query(storiesSql, [req.user.id], (err, stories) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'DB error' });
    }
    if (!stories.length) {
      return res.json({ stories: [] });
    }
    // Get the list of story IDs to fetch donation details
    const storyIds = stories.map(story => story.id);
    const donationsSql = `
      SELECT story_id, donor_name, amount
      FROM donations
      WHERE story_id IN (?)
    `;
    con.query(donationsSql, [storyIds], (err, donations) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'DB error' });
      }
      // Group donations by story_id
      const donationMap = {};
      donations.forEach(d => {
        if (!donationMap[d.story_id]) donationMap[d.story_id] = [];
        donationMap[d.story_id].push({ donor_name: d.donor_name, amount: d.amount });
      });
      // Attach the donation array to the corresponding story object
      const storiesWithDonations = stories.map(story => ({
        ...story,
        donations: donationMap[story.id] || []
      }));
      res.json({ stories: storiesWithDonations });
    });
  });
});


  // GET endpoint to fetch all stories
app.get('/api/stories', (req, res) => {

const sql = `
  SELECT
    s.*,
    u.name AS author_name,
    COALESCE(SUM(d.amount), 0) AS collected_amount,
    COUNT(d.id) AS donation_count
  FROM stories AS s
  JOIN users AS u ON u.id = s.author_id
  LEFT JOIN donations AS d ON d.story_id = s.id
  WHERE s.status = 'approved'
  GROUP BY s.id
  ORDER BY s.created_at DESC
`;

    con.execute(sql, (err, results) => {
      if (err) {
        console.error('Error fetching stories:', err);
        return res.status(500).json({ error: 'Error fetching stories' });
      }
      res.json({ stories: results });
    });
  });




  // Authentication middleware to verify the token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expect 'Bearer <token>'
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Only allow users with role==='admin'
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

//-------middleware end

// POST endpoint to submit a new story, protected by auth middleware
app.post('/api/stories', authenticateToken, upload.single('image'), (req, res) => {
  // Optionally, you can verify that req.user.id matches req.body.author_id
  const { title, description, target_amount, author_id } = req.body; //removed image_url,
    const image_url = req.file
      ? `/uploads/${req.file.filename}`
      : '';
  if (!title || !description || !target_amount || !author_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  // Example check: ensure the token owner matches the author_id provided
  if (req.user.id !== Number(author_id)) {
    return res.status(403).json({ error: 'Invalid author' });
  }
  const sql = 'INSERT INTO stories (title, description, image_url, target_amount, author_id) VALUES (?, ?, ?, ?, ?)';
  con.execute(
    sql,
    [title, description, image_url, target_amount, author_id],
    (err, results) => {
      if (err) {
        console.error('Error inserting story:', err);
        return res.status(500).json({ error: 'Error inserting story' });
      }
      res.json({ id: results.insertId });
    }
  );
});

// POST endpoint to donate
app.post('/api/stories/:id/donate', authenticateToken, (req, res) => {  // authenticateToken ensures only logged-in users can donate (and lets to record user_id)
  const storyId   = Number(req.params.id);
  const userId    = req.user?.id || null;
  const { amount, donorName } = req.body;

  if (!amount || amount <= 0)
    return res.status(400).json({ error: 'Invalid donation amount' });

  const sql = `
    INSERT INTO donations (story_id, user_id, donor_name, amount)
    VALUES (?, ?, ?, ?)
  `;
  con.execute(sql, [storyId, userId, donorName || null, amount], (err, results) => {
    if (err) {
      console.error('Error saving donation:', err);
      return res.status(500).json({ error: 'Error saving donation' });
    }
    // Return the new donation’s ID, or you could return the updated story totals.
    res.json({ donationId: results.insertId });
  });
});

// GET /api/admin/stories?status=pending
app.get(
  '/api/admin/stories',
  authenticateToken,
  requireAdmin,
  (req, res) => {
    const { status = 'pending' } = req.query;
    const sql = `
      SELECT 
        s.*, 
         u.name AS author_name,
        COALESCE(SUM(d.amount), 0) AS collected_amount
      FROM stories AS s
        JOIN users AS u ON u.id = s.author_id

      LEFT JOIN donations AS d ON d.story_id = s.id
      WHERE s.status = ?
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `;
    con.execute(sql, [status], (err, results) => {
      if (err) {
        console.error('Error fetching admin stories:', err);
        return res.status(500).json({ error: 'DB error' });
      }
      res.json({ stories: results });
    });
  }
);

// POST /api/admin/stories/:id/approve
app.post(
  '/api/admin/stories/:id/approve',
  authenticateToken,
  requireAdmin,
  (req, res) => {
    const storyId = Number(req.params.id);
    con.execute(
      'UPDATE stories SET status = "approved" WHERE id = ?',
      [storyId],
      (err) => {
        if (err) return res.status(500).json({ error: 'DB error' });
        res.json({ success: true });
      }
    );
  }
);

// DELETE /api/admin/stories/:id   
app.delete(
  '/api/admin/stories/:id',
  authenticateToken,
  requireAdmin,
  (req, res) => {
    const storyId = Number(req.params.id);
    con.execute(
      'UPDATE stories SET status = "rejected" WHERE id = ?',
      [storyId],
      (err) => {
        if (err) return res.status(500).json({ error: 'DB error' });
        res.json({ success: true });
      }
    );
  }
);


app.delete(
  '/api/admin/stories/:id/delete',
  authenticateToken,
  requireAdmin,
  (req, res) => {
    const storyId = Number(req.params.id);
    con.execute('DELETE FROM stories WHERE id = ?', [storyId], (err, results) => {
      if (err) {
        console.error('Error deleting story:', err);
        return res.status(500).json({ error: 'DB error' });
      }
      res.json({ success: true });
    });
  }
);

app.post(
  '/api/admin/stories/:id/hide',
  authenticateToken,
  requireAdmin,
  (req, res) => {
    const storyId = Number(req.params.id);
    con.execute(
      'UPDATE stories SET status = "hidden" WHERE id = ?',
      [storyId],
      (err) => {
        if (err) {
          console.error('Error hiding story:', err);
          return res.status(500).json({ error: 'DB error' });
        }
        res.json({ success: true });
      }
    );
  }
);






  console.log('About to listen on PORT');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });

  
