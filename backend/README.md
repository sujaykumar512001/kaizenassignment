# Form Submission Backend API

A Node.js backend API for handling form submissions using Express.js, Sequelize ORM, and MySQL.

## 🚀 Features

- **Form Submission**: Handle simple form submissions
- **Data Validation**: Comprehensive validation using express-validator
- **Database Integration**: MySQL with Sequelize ORM
- **CORS Support**: Cross-origin resource sharing enabled
- **Error Handling**: Global error handling and validation

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kaizen/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your database credentials
   nano .env
   ```

4. **Database Setup**
   ```sql
   -- Create MySQL database
   CREATE DATABASE form_submissions;
   
   -- Create user (optional)
   CREATE USER 'form_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON form_submissions.* TO 'form_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

5. **Update .env file**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=form_submissions
   DB_USER=root
   DB_PASSWORD=your_password_here
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3002
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/form
```

### Endpoints

#### 1. Submit Form
```http
POST /api/form
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "message": "Optional message content"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "data": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "submittedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 2. Get All Form Submissions
```http
GET /api/form
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "message": "Optional message content",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Health Check
```http
GET /health
```

## 🗂 Project Structure

```
backend/
├── config/
│   └── db.js                 # Database configuration
├── controllers/
│   └── formController.js     # Form submission logic
├── middleware/
│   └── validation.js         # Validation middleware
├── models/
│   ├── index.js              # Model exports
│   └── FormSubmission.js     # Form submission model
├── routes/
│   └── formRoutes.js         # API routes
├── server.js                 # Main server file
├── package.json
├── env.example               # Environment variables example
└── README.md
```

## 🔧 Database Schema

### Form Submissions Table
| Field | Type | Constraints |
|-------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| fullName | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | NOT NULL |
| message | TEXT | NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE |

## 🛡️ Validation Rules

- **Full Name**: Required, 1-100 characters
- **Email**: Required, valid email format
- **Message**: Optional, max 2000 characters

## 🔒 Security Features

- Input validation and sanitization
- CORS protection
- SQL injection protection (Sequelize)
- XSS protection
- Environment variable management

## 🧪 Testing

```bash
# Run tests
npm test

# Health check
curl http://localhost:5000/health
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 3306 |
| DB_NAME | Database name | form_submissions |
| DB_USER | Database user | root |
| DB_PASSWORD | Database password | - |
| CORS_ORIGIN | CORS origin | http://localhost:3002 |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support, please contact the development team or create an issue in the repository. 