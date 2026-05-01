# Personal Finance Tracker

A full-stack Personal Finance Tracker application built with Node.js, Express, PostgreSQL, and React.

## Features Included

- **Stage 1 (Core):** Transaction and Category APIs with proper PostgreSQL relations.
- **Stage 2 (Dashboard):** Aggregated financial insights (Total Income, Total Expense, Net Savings, Category Breakdown).
- **Stage 3 (Reports & Budgets):** Budget limits vs actual spending tracking, and monthly report generation.
- **Stage 4 (Advanced):** 
  - Google OAuth integration setup
  - Email Notifications via Nodemailer
  - Receipt Uploads using Multer
  - Multi-Currency support
- **Stage 5 (Polish):** Secure with Helmet, CORS, and Express-Rate-Limit.

## Setup Instructions

### 1. Database Setup
Make sure PostgreSQL is running.
Create the database and apply the schema:
```bash
createdb finance_tracker
psql -d finance_tracker -f database.sql
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finance_tracker
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
JWT_SECRET=super_secret_string
PORT=3000
GOOGLE_CLIENT_ID=optional_client_id
```

### 3. Running the Backend
```bash
npm install
npm start
```
The API server will run on `http://localhost:3000`.

### 4. Running the Frontend
```bash
cd client
npm install
npm run dev
```
The React frontend will be available at `http://localhost:5173`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/google` - Login using Google ID token

### Categories
- `POST /api/categories` - Create a new category
- `GET /api/categories` - List user's categories
- `DELETE /api/categories/:id` - Delete a category

### Transactions
- `POST /api/transactions` - Add a transaction (supports `receipt` file upload)
- `GET /api/transactions` - List all transactions
- `PUT /api/transactions/:id` - Edit a transaction
- `DELETE /api/transactions/:id` - Delete a transaction

### Insights & Budgets
- `GET /api/dashboard` - Get aggregated totals and breakdown
- `POST /api/budgets` - Set a monthly budget limit
- `GET /api/budgets` - Compare budget limit vs actual spent
- `GET /api/reports/monthly` - Month-over-month income vs expense

## Deployment
This backend is designed to be easily deployed on **Render**. Simply connect your GitHub repository, define the environment variables, and use `npm start` as the build command.
