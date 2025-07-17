# 🚀 Quick Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 1. Install Dependencies
```bash
npm install
```

## 2. Database Setup
1. Create MySQL database:
   ```sql
   CREATE DATABASE form_submissions;
   ```

2. Copy environment file:
   ```bash
   cp env.example .env
   ```

3. Update `.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=form_submissions
   DB_USER=root
   DB_PASSWORD=your_password_here
   ```

## 3. Initialize Database
```bash
npm run init-db
```

## 4. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 5. Test the API
```bash
npm test
```

## API Endpoints
- `POST /api/form` - Submit form with `{ fullName, email, message }`
- `GET /api/form` - Get all form submissions
- `GET /health` - Health check

## Frontend Integration
The API is configured to accept requests from `http://localhost:3002` (your React frontend).

Update your frontend form submission to use:
```javascript
const response = await fetch('http://localhost:5000/api/form', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fullName: 'John Doe',
    email: 'john@example.com',
    message: 'Optional message'
  })
});
``` 