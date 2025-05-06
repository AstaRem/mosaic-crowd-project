import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();  // Load .env into process.env

const pool = createPool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;