// server.js  (root of the project)
// ─────────────────────────────────────────────────────────────────────────────
// This is the entry point of the application.
// It loads the Express app and starts listening for incoming requests.
// ─────────────────────────────────────────────────────────────────────────────

import dotenv from 'dotenv'; // Load environment variables FIRST (before anything else)
dotenv.config();

import app from './src/app.js'; // Import our configured Express app

// Read PORT from .env, or fall back to 3000 if it's not set
const PORT = process.env.PORT || 3000;

// Start the server and listen on the given port
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
