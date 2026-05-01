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

-- Create the categories table
CREATE TABLE IF NOT EXISTS categories (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(100) NOT NULL,
  type       VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create the transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL, -- Keep transaction if category is deleted
  type        VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
  amount      DECIMAL(12, 2) NOT NULL,    -- DECIMAL handles exact money safely
  currency    VARCHAR(10) DEFAULT 'INR',
  date        DATE NOT NULL,
  description TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Create the budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id  INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  limit_amount DECIMAL(12, 2) NOT NULL,
  month        VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  created_at   TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, category_id, month) -- Only one budget per category per month
);
