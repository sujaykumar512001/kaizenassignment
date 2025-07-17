# Mesothelioma Legal Claim Form

A comprehensive web application for handling mesothelioma legal claims with a modern React frontend and Node.js backend with MySQL database integration.

## 🚀 Features

- **Modern React Frontend** with responsive design
- **Node.js Backend** with Express.js
- **MySQL Database** integration with Sequelize ORM
- **Form Validation** with comprehensive error handling
- **Caching System** for improved performance
- **Pagination & Search** for form submissions
- **Statistics Dashboard** with analytics
- **RESTful API** with proper HTTP status codes
- **CORS Configuration** for cross-origin requests
- **Error Handling** with detailed logging
- **Modular Architecture** with service layer pattern

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or pnpm package manager

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd kaizen
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd backend
npm install
```

### 3. Database Setup

#### Create MySQL Database
```sql
CREATE DATABASE mesothelioma_claims CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Configure Environment Variables
Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mesothelioma_claims
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password

# Server Configuration
PORT=5004
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004
```

### 4. Initialize Database
```bash
cd backend
node scripts/init-db.js
```

## 🚀 Running the Application

### Development Mode

#### Start Backend Server
```bash
cd backend
npm run dev
```
The backend will start on `http://localhost:5004`

#### Start Frontend Development Server
```bash
# In a new terminal
npm run dev
```
The frontend will start on `http://localhost:3000` (or next available port)

### Production Mode

#### Build Frontend
```bash
npm run build
```

#### Start Production Server
```bash
cd backend
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:5004/api
```

### Endpoints

#### 1. Health Check
```http
GET /health
```
**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-07-17T10:00:00.000Z",
  "environment": "development",
  "version": "1.0.0"
}
```

#### 2. Submit Form
```http
POST /api/form
Content-Type: application/json
```
**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890",
  "email": "john.doe@example.com",
  "dateOfBirth": "1990-01-01",
  "jobTitle": "Construction Worker",
  "dateOfDiagnosis": "2024-01-01",
  "diagnosisType": "pleural",
  "story": "Optional story about exposure",
  "captcha": true
}
```
**Response:**
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "submittedAt": "2025-07-17T10:00:00.000Z"
  }
}
```

#### 3. Get All Submissions
```http
GET /api/form?page=1&limit=10&search=john&sortBy=createdAt&sortOrder=DESC
```
**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for name, email, or job title
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): Sort order - ASC or DESC (default: DESC)

**Response:**
```json
{
  "success": true,
  "data": {
    "submissions": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    },
    "cached": false
  }
}
```

#### 4. Get Statistics
```http
GET /api/form/stats
```
**Response:**
```json
{
  "success": true,
  "data": {
    "totalSubmissions": 150,
    "diagnosisStats": [
      {
        "diagnosisType": "pleural",
        "count": 80
      },
      {
        "diagnosisType": "peritoneal",
        "count": 45
      }
    ],
    "monthlyStats": [
      {
        "month": "2025-07",
        "count": 25
      }
    ],
    "cached": false
  }
}
```

## 🏗️ Project Structure

```
kaizen/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   └── formController.js     # Request handlers
│   ├── middleware/
│   │   ├── errorHandler.js       # Global error handling
│   │   └── validation.js         # Input validation
│   ├── models/
│   │   └── FormSubmission.js     # Database model
│   ├── routes/
│   │   └── formRoutes.js         # API routes
│   ├── services/
│   │   └── formService.js        # Business logic layer
│   ├── scripts/
│   │   └── init-db.js            # Database initialization
│   ├── server.js                 # Main server file
│   └── package.json
├── src/
│   ├── components/
│   │   ├── Header.jsx            # Navigation header
│   │   └── Footer.jsx            # Site footer
│   ├── pages/
│   │   ├── HomePage.jsx          # Home page with form
│   │   ├── ClaimForm.jsx         # Dedicated claim form
│   │   ├── ContactPage.jsx       # Contact information
│   │   ├── AboutPage.jsx         # About page
│   │   └── SuccessPage.jsx       # Success page
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # App entry point
│   └── index.css                 # Global styles
├── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | localhost |
| `DB_PORT` | MySQL port | 3306 |
| `DB_NAME` | Database name | mesothelioma_claims |
| `DB_USER` | MySQL username | root |
| `DB_PASSWORD` | MySQL password | (empty) |
| `PORT` | Server port | 5004 |
| `NODE_ENV` | Environment | development |
| `CORS_ORIGIN` | Allowed origins | localhost:3000-3004 |

### Database Schema

The application uses a single table `form_submissions` with the following structure:

```sql
CREATE TABLE form_submissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  job_title VARCHAR(100) NOT NULL,
  date_of_diagnosis DATE NOT NULL,
  diagnosis_type ENUM('pleural', 'peritoneal', 'pericardial', 'testicular') NOT NULL,
  story TEXT,
  captcha BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_created_at (created_at),
  INDEX idx_diagnosis_type (diagnosis_type),
  INDEX idx_name_search (first_name, last_name),
  INDEX idx_job_title (job_title),
  INDEX idx_date_diagnosis (date_of_diagnosis)
);
```

## 🚀 Deployment

### Production Deployment

1. **Set Environment Variables:**
   ```bash
   NODE_ENV=production
   DB_HOST=your_production_db_host
   DB_USER=your_production_db_user
   DB_PASSWORD=your_production_db_password
   CORS_ORIGIN=https://yourdomain.com
   ```

2. **Build Frontend:**
   ```bash
   npm run build
   ```

3. **Start Production Server:**
   ```bash
   cd backend
   npm start
   ```

### Docker Deployment

1. **Build Docker Image:**
   ```bash
   docker build -t mesothelioma-claims .
   ```

2. **Run Container:**
   ```bash
   docker run -p 5004:5004 -e DB_HOST=your_db_host mesothelioma-claims
   ```

## 🧪 Testing

### API Testing
```bash
# Test health endpoint
curl http://localhost:5004/health

# Test form submission
curl -X POST http://localhost:5004/api/form \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","phone":"1234567890","email":"test@example.com","dateOfBirth":"1990-01-01","jobTitle":"Developer","dateOfDiagnosis":"2024-01-01","diagnosisType":"pleural","captcha":true}'

# Test get submissions
curl http://localhost:5004/api/form

# Test statistics
curl http://localhost:5004/api/form/stats
```

## 🔍 Error Handling

The application includes comprehensive error handling:

- **Validation Errors** (400): Invalid input data
- **Not Found** (404): Route not found
- **Database Errors** (500): Database connection issues
- **Unique Constraint** (409): Duplicate email submissions

All errors return consistent JSON responses with appropriate HTTP status codes.

## 📊 Performance Features

- **Caching**: In-memory caching for form submissions (5-minute TTL)
- **Pagination**: Efficient handling of large datasets
- **Database Indexes**: Optimized queries with proper indexing
- **Connection Pooling**: MySQL connection pooling for better performance
- **Async Operations**: Non-blocking I/O operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- **Phone**: 79-49068000
- **Email**: contactblr9@kaizentek.co.in
- **Response Time**: Within 24 hours #   k a i z e n  
 