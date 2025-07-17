const FormSubmission = require('../models/FormSubmission');
const { Op } = require('sequelize');

// Cache for form submissions (in-memory cache)
const submissionsCache = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000, // 5 minutes
  isValid() {
    return this.data && this.timestamp && (Date.now() - this.timestamp) < this.ttl;
  },
  set(data) {
    this.data = data;
    this.timestamp = Date.now();
  },
  clear() {
    this.data = null;
    this.timestamp = null;
  }
};

class FormService {
  /**
   * Create a new form submission
   * @param {Object} formData - The form data to submit
   * @returns {Promise<Object>} The created submission
   */
  static async createSubmission(formData) {
    // Clear cache when new submission is added
    submissionsCache.clear();

    const submission = await FormSubmission.create(formData, {
      returning: true,
      validate: true
    });

    return {
      id: submission.id,
      firstName: submission.firstName,
      lastName: submission.lastName,
      email: submission.email,
      submittedAt: submission.createdAt
    };
  }

  /**
   * Get all form submissions with pagination and search
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Paginated submissions
   */
  static async getSubmissions(options = {}) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = options;
    
    // Check cache first
    if (submissionsCache.isValid() && !search) {
      return {
        ...submissionsCache.data,
        cached: true
      };
    }

    // Build optimized query
    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { jobTitle: { [Op.like]: `%${search}%` } }
      ];
    }

    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Optimized query with specific attributes and pagination
    const { count, rows: submissions } = await FormSubmission.findAndCountAll({
      where: whereClause,
      attributes: [
        'id', 
        'firstName', 
        'lastName', 
        'email', 
        'jobTitle', 
        'diagnosisType', 
        'createdAt'
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });

    const responseData = {
      submissions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    };

    // Cache the results if no search filter
    if (!search) {
      submissionsCache.set(responseData);
    }

    return {
      ...responseData,
      cached: false
    };
  }

  /**
   * Get submission statistics
   * @returns {Promise<Object>} Statistics data
   */
  static async getStatistics() {
    // Check cache for stats
    if (submissionsCache.isValid() && submissionsCache.data?.stats) {
      return {
        ...submissionsCache.data.stats,
        cached: true
      };
    }

    // Optimized aggregation queries for SQLite
    const [totalSubmissions, diagnosisStats, monthlyStats] = await Promise.all([
      FormSubmission.count(),
      FormSubmission.findAll({
        attributes: [
          'diagnosisType',
          [FormSubmission.sequelize.fn('COUNT', FormSubmission.sequelize.col('id')), 'count']
        ],
        group: ['diagnosisType'],
        raw: true
      }),
      FormSubmission.findAll({
        attributes: [
          [FormSubmission.sequelize.fn('strftime', '%Y-%m', FormSubmission.sequelize.col('createdAt')), 'month'],
          [FormSubmission.sequelize.fn('COUNT', FormSubmission.sequelize.col('id')), 'count']
        ],
        group: [FormSubmission.sequelize.fn('strftime', '%Y-%m', FormSubmission.sequelize.col('createdAt'))],
        order: [[FormSubmission.sequelize.fn('strftime', '%Y-%m', FormSubmission.sequelize.col('createdAt')), 'DESC']],
        limit: 12,
        raw: true
      })
    ]);

    const stats = {
      totalSubmissions,
      diagnosisStats,
      monthlyStats
    };

    return {
      ...stats,
      cached: false
    };
  }

  /**
   * Validate form data
   * @param {Object} formData - The form data to validate
   * @returns {Array} Array of validation errors
   */
  static validateFormData(formData) {
    const errors = [];
    
    if (!formData.firstName?.trim()) errors.push('First name is required');
    if (!formData.lastName?.trim()) errors.push('Last name is required');
    if (!formData.phone?.trim()) errors.push('Phone number is required');
    if (!formData.email?.trim()) errors.push('Email is required');
    if (!formData.dateOfBirth) errors.push('Date of birth is required');
    if (!formData.jobTitle?.trim()) errors.push('Job title is required');
    if (!formData.dateOfDiagnosis) errors.push('Date of diagnosis is required');
    if (!formData.diagnosisType) errors.push('Diagnosis type is required');
    if (!formData.captcha) errors.push('Please verify you are a person');
    
    return errors;
  }
}

module.exports = FormService; 