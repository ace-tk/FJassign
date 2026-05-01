// src/app.js
// ─────────────────────────────────────────────────────────────────────────────
// This is the Express application setup file.
// It wires together all middleware and routes.
// Think of it as the "main hub" of the application.
// ─────────────────────────────────────────────────────────────────────────────

import express    from 'express';
import cors       from 'cors';      // Allows requests from other origins (e.g. frontend apps)
import helmet     from 'helmet';    // Sets secure HTTP headers automatically
import morgan     from 'morgan';    // Logs every incoming request to the console
import authRoutes from './routes/authRoutes.js';

// Create the Express app
const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
// Middleware runs on EVERY request before it reaches the route handler.

app.use(helmet());          // Adds security headers (protects against common attacks)
app.use(cors());            // Enables Cross-Origin Resource Sharing
app.use(morgan('dev'));     // Logs requests like: GET /api/auth/login 200 5ms
app.use(express.json());   // Parses incoming JSON request bodies (needed for POST/PUT)

// ─── Routes ───────────────────────────────────────────────────────────────────
// Mount the auth router at the /api/auth path prefix.
// So router.post('/register') becomes POST /api/auth/register
app.use('/api/auth', authRoutes);

// ─── Root Route ───────────────────────────────────────────────────────────────
// A simple health check to confirm the server is running
app.get('/', (req, res) => {
  res.json({ message: 'Personal Finance Tracker API is running!' });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
// If no route matched, return a 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

export default app;
