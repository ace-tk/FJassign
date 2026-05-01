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
import path       from 'path';      // Node.js built-in to work with file paths
import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js'; // Protected test route

// Create the Express app
const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
// Middleware runs on EVERY request before it reaches the route handler.

app.use(helmet({            // Adds security headers (protects against common attacks)
  // Allow inline scripts in our simple frontend HTML files
  contentSecurityPolicy: false,
}));
app.use(cors());            // Enables Cross-Origin Resource Sharing
app.use(morgan('dev'));     // Logs requests like: GET /api/auth/login 200 5ms
app.use(express.json());   // Parses incoming JSON request bodies (needed for POST/PUT)

// ─── Serve Frontend Files ─────────────────────────────────────────────────────
// Serve all files in the /frontend folder as static assets.
// Visiting http://localhost:3000/register.html will serve frontend/register.html
const __dirname = path.resolve(); // Get the root directory of the project
app.use(express.static(path.join(__dirname, 'frontend')));

// ─── Routes ───────────────────────────────────────────────────────────────────
// Mount the auth router at the /api/auth path prefix.
// So router.post('/register') becomes POST /api/auth/register
app.use('/api/auth', authRoutes);

// Mount the test router at /api/test
// Any request to GET /api/test goes through authMiddleware first (inside testRoutes)
app.use('/api/test', testRoutes);

// ─── Root API Health Check ────────────────────────────────────────────────────
// A simple JSON response to confirm the API is running (from Postman or browser)
app.get('/api', (req, res) => {
  res.json({ message: 'Personal Finance Tracker API is running!' });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
// If no route matched, return a 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

export default app;
