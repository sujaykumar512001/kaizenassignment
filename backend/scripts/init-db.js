const { sequelize } = require('../config/db');
const FormSubmission = require('../models/FormSubmission');
require('dotenv').config();

const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');
    
    // First, let's check if there are duplicate emails
    const duplicates = await sequelize.query(`
      SELECT email, COUNT(*) as count 
      FROM form_submissions 
      GROUP BY email 
      HAVING COUNT(*) > 1
    `, { type: sequelize.QueryTypes.SELECT });
    
    if (duplicates.length > 0) {
      console.log('⚠️  Found duplicate emails, cleaning up...');
      
      // Remove duplicates, keeping only the first occurrence
      for (const dup of duplicates) {
        await sequelize.query(`
          DELETE FROM form_submissions 
          WHERE email = ? 
          AND id NOT IN (
            SELECT MIN(id) 
            FROM form_submissions 
            WHERE email = ?
          )
        `, { 
          replacements: [dup.email, dup.email],
          type: sequelize.QueryTypes.DELETE 
        });
      }
      console.log('✅ Duplicate emails removed');
    }
    
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