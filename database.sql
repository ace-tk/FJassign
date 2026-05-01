-- ─────────────────────────────────────────────────────────
-- SQL to create the users table in your PostgreSQL database
-- Run this once before starting the server
-- ─────────────────────────────────────────────────────────

-- Create the database (run this separately if needed)
-- CREATE DATABASE finance_tracker;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,           -- Auto-incrementing unique ID
  name       VARCHAR(100) NOT NULL,        -- User's full name
  email      VARCHAR(150) UNIQUE NOT NULL, -- Must be unique, cannot be empty
  password   VARCHAR(255) NOT NULL,        -- Hashed password (never plain text)
  created_at TIMESTAMP DEFAULT NOW()       -- Automatically set when row is inserted
);
