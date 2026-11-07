const { body, validationResult } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// Validation rules for Doctor
const doctorRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Doctor name is required')
    .isLength({ max: 100 })
    .withMessage('Doctor name cannot exceed 100 characters'),
  body('specialization')
    .trim()
    .notEmpty()
    .withMessage('Specialization is required'),
  body('hospital')
    .trim()
    .notEmpty()
    .withMessage('Hospital name is required'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid doctor email address'),
  body('experienceYears')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Experience years must be a non-negative integer'),
];

// Validation rules for Patient
const patientRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Patient name is required')
    .isLength({ max: 100 })
    .withMessage('Patient name cannot exceed 100 characters'),
  body('age')
    .isInt({ min: 0, max: 130 })
    .withMessage('Patient age must be between 0 and 130'),
  body('gender')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  body('condition')
    .trim()
    .notEmpty()
    .withMessage('Medical condition / diagnosis is required'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Contact phone is required'),
  body('doctor')
    .notEmpty()
    .withMessage('Assigned doctor is required'),
  body('status')
    .optional()
    .isIn(['Active', 'In Treatment', 'Critical', 'Discharged'])
    .withMessage('Status must be Active, In Treatment, Critical, or Discharged'),
];

// Validation rules for Login
const loginRules = [
  body('email').trim().isEmail().withMessage('Please enter a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = {
  validate,
  doctorRules,
  patientRules,
  loginRules,
};
