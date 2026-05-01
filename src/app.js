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
import rateLimit  from 'express-rate-limit'; // Basic rate limiting
import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js'; // Protected test route
import categoryRoutes from './routes/categoryRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

// Create the Express app
const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
// Middleware runs on EVERY request before it reaches the route handler.

// Global Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests, please try again later.' }
});

app.use(limiter);
app.use(helmet({            // Adds security headers (protects against common attacks)
  // Allow inline scripts in our simple frontend HTML files
  contentSecurityPolicy: false,
}));
app.use(cors());            // Enables Cross-Origin Resource Sharing
app.use(morgan('dev'));     // Logs requests like: GET /api/auth/login 200 5ms
app.use(express.json());   // Parses incoming JSON request bodies (needed for POST/PUT)

// Serve uploads folder statically for receipts
const __dirname = path.resolve(); // Get the root directory of the project
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/reports', reportRoutes);

// ─── Root API Health Check ────────────────────────────────────────────────────
// This ensures that visiting the root URL (/) shows the API is alive.
app.get('/', (req, res) => {
  res.send('API is running');
});

// Also keep the /api health check just in case
app.get('/api', (req, res) => {
  res.json({ message: 'Personal Finance Tracker API is running!' });
});

// ─── 404 Handler for API routes ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found.' });
});

// Export the app (server.js will import this and call app.listen)
export default app;
