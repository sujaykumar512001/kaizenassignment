const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FormSubmission = sequelize.define('FormSubmission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  jobTitle: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  dateOfDiagnosis: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  diagnosisType: {
    type: DataTypes.ENUM('pleural', 'peritoneal', 'pericardial', 'testicular'),
    allowNull: false
  },
  story: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 2000]
    }
  },
  captcha: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'form_submissions',
  timestamps: true,
  underscored: true,
  // Optimize indexes for better query performance
  indexes: [
    {
      name: 'idx_email',
      fields: ['email']
    },
    {
      name: 'idx_created_at',
      fields: ['created_at']
    },
    {
      name: 'idx_diagnosis_type',
      fields: ['diagnosis_type']
    },
    {
      name: 'idx_name_search',
      fields: ['first_name', 'last_name']
    },
    {
      name: 'idx_job_title',
      fields: ['job_title']
    },
    {
      name: 'idx_date_diagnosis',
      fields: ['date_of_diagnosis']
    }
  ],
  // Add hooks for data validation and optimization
  hooks: {
    beforeCreate: (instance) => {
      // Normalize data before saving
      if (instance.email) {
        instance.email = instance.email.toLowerCase().trim();
      }
      if (instance.firstName) {
        instance.firstName = instance.firstName.trim();
      }
      if (instance.lastName) {
        instance.lastName = instance.lastName.trim();
      }
      if (instance.phone) {
        instance.phone = instance.phone.trim();
      }
      if (instance.jobTitle) {
        instance.jobTitle = instance.jobTitle.trim();
      }
    },
    beforeUpdate: (instance) => {
      // Normalize data before updating
      if (instance.changed('email')) {
        instance.email = instance.email.toLowerCase().trim();
      }
      if (instance.changed('firstName')) {
        instance.firstName = instance.firstName.trim();
      }
      if (instance.changed('lastName')) {
        instance.lastName = instance.lastName.trim();
      }
      if (instance.changed('phone')) {
        instance.phone = instance.phone.trim();
      }
      if (instance.changed('jobTitle')) {
        instance.jobTitle = instance.jobTitle.trim();
      }
    }
  }
});

module.exports = FormSubmission; 