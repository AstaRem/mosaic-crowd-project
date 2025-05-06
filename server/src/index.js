// server/src/index.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import pool from './config/db.js';

const app = express();
const PORT = process.env.PORT ?? 5000;

// Test DB connection
try {
  const conn = await pool.getConnection();
  console.log('✅ Connected to MySQL as id', conn.threadId);
  conn.release();
} catch (err) {
  console.error('❌ MySQL connection error:', err);
}

app.get('/', (req, res) => {
  res.send('API is up and running!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
