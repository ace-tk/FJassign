// src/config/db.js
// ─────────────────────────────────────────────────────────────────────────────
// This file sets up the connection to our PostgreSQL database.
// We use a "Pool" which keeps multiple connections ready (efficient for web apps).
// ─────────────────────────────────────────────────────────────────────────────

import pg from 'pg';         // The PostgreSQL driver for Node.js
import dotenv from 'dotenv'; // Lets us read from our .env file

dotenv.config(); // Load all variables from .env into process.env

// Destructure the Pool class from pg
const { Pool } = pg;

// Create a new connection pool using credentials from our .env file
const pool = new Pool({
  host:     process.env.DB_HOST,     // e.g. "localhost"
  port:     process.env.DB_PORT,     // e.g. 5432
  database: process.env.DB_NAME,     // e.g. "finance_tracker"
  user:     process.env.DB_USER,     // e.g. "postgres"
  password: process.env.DB_PASSWORD, // Your PostgreSQL password
});

// Export the pool so other files can use it to run queries
export default pool;
