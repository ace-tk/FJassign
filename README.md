# Personal Finance Tracker – Backend

A clean, beginner-friendly REST API backend built with **Node.js**, **Express.js**, and **PostgreSQL**.

---

## 📁 Folder Structure

```
FJassign/
├── server.js              ← Entry point, starts the server
├── package.json
├── .env                   ← Your environment variables (never commit this!)
├── .env.example           ← Template showing what variables are needed
├── database.sql           ← SQL to create the users table
└── src/
    ├── app.js             ← Express app, middleware & routes wired together
    ├── config/
    │   └── db.js          ← PostgreSQL connection pool
    ├── controllers/
    │   └── authController.js  ← Register & Login logic
    ├── middleware/
    │   └── authMiddleware.js  ← JWT verification (protect routes)
    └── routes/
        └── authRoutes.js  ← Maps URLs to controller functions
```

---

## ⚡ Quick Start

### 1. Setup Environment
```bash
cp .env.example .env
# Then edit .env with your actual database credentials
```

### 2. Create the Database
```sql
-- In psql or pgAdmin:
CREATE DATABASE finance_tracker;
-- Then run database.sql to create the users table
```

### 3. Run the Server
```bash
npm run dev     # Development (auto-restarts on file changes)
npm start       # Production
```

---

## 📡 API Endpoints

### Register — `POST /api/auth/register`
```json
// Request Body
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}

// Success Response (201)
{
  "message": "Registration successful!",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-05-01T05:00:00.000Z"
  }
}
```

### Login — `POST /api/auth/login`
```json
// Request Body
{
  "email": "john@example.com",
  "password": "secret123"
}

// Success Response (200)
{
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-05-01T05:00:00.000Z"
  }
}
```

### Using Protected Routes
Add the token to your request header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```
