// src/controllers/authController.js
// ─────────────────────────────────────────────────────────────────────────────
// Controllers contain the actual business logic for each API endpoint.
// Think of controllers as the "brain" — they decide what to do with each request.
// ─────────────────────────────────────────────────────────────────────────────

import bcrypt   from 'bcrypt';
import jwt      from 'jsonwebtoken';
import pool     from '../config/db.js'; // Our database connection pool

// ─── REGISTER ────────────────────────────────────────────────────────────────
// POST /api/auth/register
// Creates a new user account

export const register = async (req, res) => {
  // Step 1: Pull name, email, and password from the request body
  const { name, email, password } = req.body;

  // Step 2: Basic validation — make sure all fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password.' });
  }

  // Step 3: Password length check
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  try {
    // Step 4: Check if this email is already registered
    // We query the database for a user with the same email
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email] // $1 is a placeholder — this prevents SQL injection
    );

    if (existingUser.rows.length > 0) {
      // rows.length > 0 means a user with that email was found
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    // Step 5: Hash the password before saving it
    // bcrypt.hash(password, saltRounds) — 10 salt rounds is a safe standard
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 6: Insert the new user into the database
    // RETURNING * gives us back the newly created row
    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, hashedPassword]
    );

    // Step 7: Get the new user from the query result
    const newUser = result.rows[0];

    // Step 8: Respond with the new user (no password in response!)
    return res.status(201).json({
      message: 'Registration successful!',
      user: newUser,
    });

  } catch (error) {
    console.error('Register error:', error.message);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


// ─── LOGIN ────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Logs in an existing user and returns a JWT token

export const login = async (req, res) => {
  // Step 1: Pull email and password from the request body
  const { email, password } = req.body;

  // Step 2: Make sure both fields are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  try {
    // Step 3: Look up the user by email in the database
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    // Step 4: If no user found, return an error (don't reveal which field is wrong)
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Step 5: We found a user — get the full record
    const user = result.rows[0];

    // Step 6: Compare the provided password with the hashed password in the DB
    // bcrypt.compare() returns true if they match
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Step 7: Password is correct — create a JWT token
    // jwt.sign(payload, secret, options)
    // payload: data to embed in the token (like user ID and email)
    // secret: a private key to sign the token so nobody can fake it
    // expiresIn: the token becomes invalid after 1 day
    const token = jwt.sign(
      { id: user.id, email: user.email }, // Payload (data stored in token)
      process.env.JWT_SECRET,             // Secret key from .env
      { expiresIn: '1d' }                 // Token expires in 1 day
    );

    // Step 8: Return the token and user info (no password!)
    return res.status(200).json({
      message: 'Login successful!',
      token,                              // Send token to client
      user: {
        id:         user.id,
        name:       user.name,
        email:      user.email,
        created_at: user.created_at,
      },
    });

  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
