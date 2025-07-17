const FormService = require('../services/formService');

// Submit form with optimized validation and error handling
const submitForm = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      phone, 
      email, 
      dateOfBirth, 
      jobTitle, 
      dateOfDiagnosis, 
      diagnosisType, 
      story, 
      captcha 
    } = req.body;

    // Prepare form data
    const formData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      email: email.toLowerCase().trim(),
      dateOfBirth,
      jobTitle: jobTitle.trim(),
      dateOfDiagnosis,
      diagnosisType: diagnosisType.trim(),
      story: story ? story.trim() : null,
      captcha
    };

    // Create submission using service
    const responseData = await FormService.createSubmission(formData);

    res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      data: responseData
    });

  } catch (error) {
    console.error('Error submitting form:', error);
    
    // Handle specific database errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'A submission with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

// Get all form submissions with caching and pagination
const getAllSubmissions = async (req, res) => {
  try {
    const { page, limit, search, sortBy, sortOrder } = req.query;
    
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      search,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'DESC'
    };

    const result = await FormService.getSubmissions(options);

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

// Get submission statistics (cached)
const getSubmissionStats = async (req, res) => {
  try {
    const stats = await FormService.getStatistics();

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching submission stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

module.exports = {
  submitForm,
  getAllSubmissions,
  getSubmissionStats
}; 