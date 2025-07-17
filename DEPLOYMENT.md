# 🚀 Deployment Guide

## Overview
This application consists of two parts:
- **Frontend**: React/Vite application
- **Backend**: Node.js/Express API

## Deployment Options

### Option 1: Vercel (Recommended)

#### Frontend Deployment (Vercel)
1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend**:
   ```bash
   # From project root
   vercel
   ```

3. **Set Environment Variables** in Vercel Dashboard:
   - `REACT_APP_API_URL`: Your backend URL

#### Backend Deployment (Vercel)
1. **Deploy Backend**:
   ```bash
   # From backend directory
   cd backend
   vercel
   ```

2. **Set Environment Variables** in Vercel Dashboard:
   - `NODE_ENV`: production
   - `DB_HOST`: Your PostgreSQL host
   - `DB_PORT`: 5432
   - `DB_NAME`: Your database name
   - `DB_USER`: Your database user
   - `DB_PASSWORD`: Your database password
   - `DB_SSL`: true
   - `CORS_ORIGIN`: Your frontend URL
   - `JWT_SECRET`: Your secure JWT secret

### Option 2: Heroku

#### Backend Deployment (Heroku)
1. **Install Heroku CLI**
2. **Create Heroku App**:
   ```bash
   cd backend
   heroku create your-app-name
   ```

3. **Add PostgreSQL Addon**:
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Set Environment Variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set CORS_ORIGIN=https://your-frontend-domain.vercel.app
   heroku config:set JWT_SECRET=your_secure_jwt_secret
   ```

5. **Deploy**:
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

#### Frontend Deployment (Vercel)
Deploy frontend to Vercel as described above.

### Option 3: Railway

#### Backend Deployment (Railway)
1. **Connect GitHub repository**
2. **Set Environment Variables** in Railway Dashboard
3. **Deploy automatically**

## Database Setup

### Development (SQLite)
- Already configured
- Database file: `backend/database.sqlite`

### Production (PostgreSQL)
1. **Create PostgreSQL database**
2. **Set environment variables**:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_SSL`

3. **Initialize database**:
   ```bash
   cd backend
   npm run init-db
   ```

## Environment Variables

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-domain.vercel.app
```

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
DB_HOST=your_postgres_host
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_SSL=true
CORS_ORIGIN=https://your-frontend-domain.vercel.app
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=24h
```

## Pre-deployment Checklist

### Frontend
- [ ] Build works: `npm run build`
- [ ] Environment variables set
- [ ] API URL configured for production

### Backend
- [ ] Database connection tested
- [ ] Environment variables set
- [ ] CORS origins configured
- [ ] Health endpoint working

## Post-deployment Verification

1. **Test Frontend**: Visit your frontend URL
2. **Test Form Submission**: Submit a test form
3. **Test Admin Panel**: Access `/admin` route
4. **Test API**: Check health endpoint
5. **Test Database**: Verify data is being stored

## Troubleshooting

### Common Issues
1. **CORS Errors**: Check CORS_ORIGIN environment variable
2. **Database Connection**: Verify database credentials
3. **API 404**: Check API routes configuration
4. **Build Errors**: Check for missing dependencies

### Debug Commands
```bash
# Test backend locally
cd backend
npm start

# Test frontend build
npm run build
npm run preview

# Check environment variables
echo $NODE_ENV
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use strong, unique secrets
3. **Database**: Use SSL connections in production
4. **CORS**: Restrict origins to your domains only
5. **Input Validation**: All inputs are validated server-side

## Performance Optimization

1. **Database Indexing**: Add indexes for frequently queried fields
2. **Caching**: Implement Redis for session storage
3. **CDN**: Use CDN for static assets
4. **Compression**: Enable gzip compression
5. **Rate Limiting**: Implement API rate limiting 