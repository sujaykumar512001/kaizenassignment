const express = require('express');
const router = express.Router();
const { 
  submitForm, 
  getAllSubmissions,
  getSubmissionStats
} = require('../controllers/formController');
const { 
  formValidationRules, 
  handleValidationErrors 
} = require('../middleware/validation');

// Submit form
router.post('/', 
  formValidationRules, 
  handleValidationErrors, 
  submitForm
);

// Get all form submissions with pagination and search
router.get('/', getAllSubmissions);

// Get submission statistics
router.get('/stats', getSubmissionStats);

module.exports = router; 