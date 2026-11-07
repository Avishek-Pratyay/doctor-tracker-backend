const express = require('express');
const router = express.Router();
const {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientFilterOptions,
} = require('../controllers/patientController');
const { protect } = require('../middleware/auth');
const { patientRules, validate } = require('../middleware/validator');

// Protect all patient routes
router.use(protect);

router.route('/').get(getPatients).post(patientRules, validate, createPatient);
router.route('/filters').get(getPatientFilterOptions);
router.route('/:id').get(getPatientById).put(updatePatient).delete(deletePatient);

module.exports = router;
