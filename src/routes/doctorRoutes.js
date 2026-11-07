const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  addPatientToDoctor,
  deletePatientFromDoctor,
  getDoctorFilterOptions,
} = require('../controllers/doctorController');
const { protect } = require('../middleware/auth');

// Protect all doctor routes
router.use(protect);

router.route('/').get(getDoctors).post(createDoctor);
router.route('/filters').get(getDoctorFilterOptions);
router.route('/:id').get(getDoctorById).put(updateDoctor).delete(deleteDoctor);

// Nested routes for managing patients directly under a specific doctor
router.route('/:id/patients').post(addPatientToDoctor);
router.route('/:id/patients/:patientId').delete(deletePatientFromDoctor);

module.exports = router;
