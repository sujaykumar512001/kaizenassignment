const FormSubmission = require('../models/FormSubmission');
const { Op } = require('sequelize');

// Enhanced cache for form submissions with better TTL management
const submissionsCache = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000, // 5 minutes
  stats: null,
  statsTimestamp: null,
  statsTtl: 2 * 60 * 1000, // 2 minutes for stats
  
  isValid() {
    return this.data && this.timestamp && (Date.now() - this.timestamp) < this.ttl;
  },
  
  isStatsValid() {
    return this.stats && this.statsTimestamp && (Date.now() - this.statsTimestamp) < this.statsTtl;
  },
  
  set(data) {
    this.data = data;
    this.timestamp = Date.now();
  },
  
  setStats(stats) {
    this.stats = stats;
    this.statsTimestamp = Date.now();
  },
  
  clear() {
    this.data = null;
    this.timestamp = null;
    this.stats = null;
    this.statsTimestamp = null;
  },
  
  clearStats() {
    this.stats = null;
    this.statsTimestamp = null;
  }
};

class FormService {
  /**
   * Create a new form submission with enhanced validation and error handling
   * @param {Object} formData - The form data to submit
   * @returns {Promise<Object>} The created submission
   */
  static async createSubmission(formData) {
    try {
      // Validate form data first
      const validationErrors = this.validateFormData(formData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Check for duplicate email within last 24 hours
      const existingSubmission = await FormSubmission.findOne({
        where: {
          email: formData.email,
          created_at: {
            [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      });

      if (existingSubmission) {
        throw new Error('A submission with this email already exists within the last 24 hours');
      }

      // Clear cache when new submission is added
      submissionsCache.clear();

      const submission = await FormSubmission.create(formData, {
        returning: true,
        validate: true
      });

      console.log(`New form submission created: ID ${submission.id}, Email: ${submission.email}`);

      return {
        id: submission.id,
        firstName: submission.firstName,
        lastName: submission.lastName,
        email: submission.email,
        submittedAt: submission.created_at,
        message: 'Form submitted successfully'
      };
    } catch (error) {
      console.error('Error creating form submission:', error);
      
      // Handle Sequelize validation errors
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => err.message);
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }
      
      // Handle unique constraint violations
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('A submission with this email already exists');
      }
      
      throw error;
    }
  }

  /**
   * Get all form submissions with enhanced pagination, search, and filtering
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Paginated submissions
   */
  static async getSubmissions(options = {}) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search, 
        sortBy = 'created_at', 
        sortOrder = 'DESC',
        diagnosisType,
        dateFrom,
        dateTo
      } = options;
      
      // Check cache first (only for basic queries without filters)
      if (submissionsCache.isValid() && !search && !diagnosisType && !dateFrom && !dateTo) {
        return {
          ...submissionsCache.data,
          cached: true
        };
      }

      // Build enhanced where clause
      const whereClause = {};
      
      if (search) {
        whereClause[Op.or] = [
          { firstName: { [Op.like]: `%${search}%` } },
          { lastName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { jobTitle: { [Op.like]: `%${search}%` } }
        ];
      }
      
      if (diagnosisType) {
        whereClause.diagnosisType = diagnosisType;
      }
      
      if (dateFrom || dateTo) {
        whereClause.created_at = {};
        if (dateFrom) {
          whereClause.created_at[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          whereClause.created_at[Op.lte] = new Date(dateTo);
        }
      }

      // Calculate pagination
      const offset = (page - 1) * limit;
      const actualLimit = Math.min(parseInt(limit), 100); // Cap at 100 items per page
      
      // Enhanced query with better error handling
      const { count, rows: submissions } = await FormSubmission.findAndCountAll({
        where: whereClause,
        attributes: [
          'id', 
          'firstName', 
          'lastName', 
          'email', 
          'phone',
          'jobTitle', 
          'diagnosisType',
          'dateOfDiagnosis',
          'created_at'
        ],
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: actualLimit,
        offset: parseInt(offset),
        distinct: true
      });

      const responseData = {
        submissions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / actualLimit),
          totalItems: count,
          itemsPerPage: actualLimit,
          hasNextPage: parseInt(page) < Math.ceil(count / actualLimit),
          hasPrevPage: parseInt(page) > 1
        },
        filters: {
          search: search || null,
          diagnosisType: diagnosisType || null,
          dateFrom: dateFrom || null,
          dateTo: dateTo || null
        }
      };

      // Cache the results only for basic queries
      if (!search && !diagnosisType && !dateFrom && !dateTo) {
        submissionsCache.set(responseData);
      }

      return {
        ...responseData,
        cached: false
      };
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw new Error('Failed to fetch form submissions');
    }
  }

  /**
   * Get enhanced submission statistics with better error handling
   * @returns {Promise<Object>} Statistics data
   */
  static async getStatistics() {
    try {
      // Check cache for stats
      if (submissionsCache.isStatsValid()) {
        return {
          ...submissionsCache.stats,
          cached: true
        };
      }

      // Enhanced aggregation queries with better error handling
      const [totalSubmissions, diagnosisStats, monthlyStats, recentSubmissions] = await Promise.all([
        FormSubmission.count(),
        FormSubmission.findAll({
          attributes: [
            'diagnosisType',
            [FormSubmission.sequelize.fn('COUNT', FormSubmission.sequelize.col('id')), 'count']
          ],
          group: ['diagnosisType'],
          order: [[FormSubmission.sequelize.fn('COUNT', FormSubmission.sequelize.col('id')), 'DESC']],
          raw: true
        }),
        FormSubmission.findAll({
          attributes: [
            [FormSubmission.sequelize.fn('strftime', '%Y-%m', FormSubmission.sequelize.col('created_at')), 'month'],
            [FormSubmission.sequelize.fn('COUNT', FormSubmission.sequelize.col('id')), 'count']
          ],
          group: ['month'],
          order: [['month', 'DESC']],
          limit: 12,
          raw: true
        }),
        FormSubmission.count({
          where: {
            created_at: {
              [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
            }
          }
        })
      ]);

      // Calculate additional time-based stats
      const now = new Date();
      const thisMonth = monthlyStats.find(s => s.month === now.toISOString().slice(0, 7))?.count || 0;
      
      const stats = {
        totalSubmissions,
        diagnosisStats,
        monthlyStats,
        recentSubmissions,
        thisMonth,
        thisWeek: recentSubmissions,
        today: 0, // Will be calculated separately if needed
        averagePerMonth: monthlyStats.length > 0 
          ? Math.round(totalSubmissions / monthlyStats.length) 
          : 0,
        topDiagnosis: diagnosisStats.length > 0 ? diagnosisStats[0] : null
      };

      // Cache the stats
      submissionsCache.setStats(stats);

      return {
        ...stats,
        cached: false
      };
    } catch (error) {
      console.error('Error fetching submission stats:', error);
      
      // Return basic stats even if detailed stats fail
      try {
        const totalSubmissions = await FormSubmission.count();
        return {
          totalSubmissions,
          diagnosisStats: [],
          monthlyStats: [],
          recentSubmissions: 0,
          thisMonth: 0,
          thisWeek: 0,
          today: 0,
          averagePerMonth: 0,
          topDiagnosis: null,
          cached: false,
          error: 'Some statistics could not be loaded'
        };
      } catch (fallbackError) {
        console.error('Fallback stats also failed:', fallbackError);
        throw new Error('Unable to fetch statistics');
      }
    }
  }

  /**
   * Enhanced form data validation with better error messages
   * @param {Object} formData - The form data to validate
   * @returns {Array} Array of validation errors
   */
  static validateFormData(formData) {
    const errors = [];
    
    // Required field validation
    if (!formData.firstName?.trim()) {
      errors.push('First name is required');
    } else if (formData.firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters long');
    }
    
    if (!formData.lastName?.trim()) {
      errors.push('Last name is required');
    } else if (formData.lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters long');
    }
    
    if (!formData.phone?.trim()) {
      errors.push('Phone number is required');
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.push('Please enter a valid phone number');
    }
    
    if (!formData.email?.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.push('Please enter a valid email address');
    }
    
    if (!formData.dateOfBirth) {
      errors.push('Date of birth is required');
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 18 || age > 120) {
        errors.push('Date of birth must be for a person between 18 and 120 years old');
      }
    }
    
    if (!formData.jobTitle?.trim()) {
      errors.push('Job title is required');
    }
    
    if (!formData.dateOfDiagnosis) {
      errors.push('Date of diagnosis is required');
    } else {
      const diagnosisDate = new Date(formData.dateOfDiagnosis);
      if (diagnosisDate > new Date()) {
        errors.push('Date of diagnosis cannot be in the future');
      }
    }
    
    if (!formData.diagnosisType) {
      errors.push('Diagnosis type is required');
    }
    
    if (!formData.captcha) {
      errors.push('Please verify you are a person');
    }
    
    return errors;
  }

  /**
   * Clear all caches (useful for admin operations)
   */
  static clearCache() {
    submissionsCache.clear();
    console.log('Form service cache cleared');
  }

  /**
   * Get a single submission by ID
   * @param {number} id - The submission ID
   * @returns {Promise<Object>} The submission
   */
  static async getSubmissionById(id) {
    try {
      const submission = await FormSubmission.findByPk(id);
      if (!submission) {
        throw new Error('Submission not found');
      }
      return submission;
    } catch (error) {
      console.error(`Error fetching submission ${id}:`, error);
      throw error;
    }
  }
}

module.exports = FormService; 