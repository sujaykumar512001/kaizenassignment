const { body, validationResult } = require('express-validator');

// Validation rules for mesothelioma claim form submission
const formValidationRules = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please enter a valid phone number'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('dateOfBirth')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isISO8601()
    .withMessage('Please enter a valid date of birth'),

  body('jobTitle')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Job title must be between 1 and 100 characters'),

  body('dateOfDiagnosis')
    .notEmpty()
    .withMessage('Date of diagnosis is required')
    .isISO8601()
    .withMessage('Please enter a valid date of diagnosis'),

  body('diagnosisType')
    .trim()
    .notEmpty()
    .withMessage('Diagnosis type is required')
    .isIn(['pleural', 'peritoneal', 'pericardial', 'testicular'])
    .withMessage('Please select a valid diagnosis type'),

  body('story')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Story must not exceed 2000 characters'),

  body('captcha')
    .notEmpty()
    .withMessage('Please verify you are a person')
    .isBoolean()
    .withMessage('Captcha verification is required')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};

module.exports = {
  formValidationRules,
  handleValidationErrors
}; 