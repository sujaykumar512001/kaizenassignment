const { sequelize } = require('../config/db');
const FormSubmission = require('../models/FormSubmission');
require('dotenv').config();

const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');
    
    // Sync all models with database
    await sequelize.sync({ force: false, alter: true });
    
    console.log('✅ Database initialized successfully!');
    console.log('📊 Tables created/updated:');
    console.log('   - form_submissions');
    
    // Test the connection
    await sequelize.authenticate();
    console.log('✅ Database connection verified!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

// Run initialization
initializeDatabase(); 