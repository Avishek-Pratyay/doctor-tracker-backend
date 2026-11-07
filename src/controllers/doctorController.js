const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// @desc    Get all doctors with search, filtering, and pagination
// @route   GET /api/doctors
// @access  Private
exports.getDoctors = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 8));
    const skip = (page - 1) * limit;

    const {
      search,
      specialization,
      hospital,
      status,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query = {};

    // Search functionality (name, specialization, hospital, email)
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { specialization: regex },
        { hospital: regex },
        { email: regex },
        { phone: regex },
      ];
    }

    // Filter by Specialization
    if (specialization && specialization !== 'All') {
      query.specialization = specialization;
    }

    // Filter by Hospital
    if (hospital && hospital !== 'All') {
      query.hospital = hospital;
    }

    // Filter by Status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Date-wise filtering (created between startDate and endDate)
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        // Include the entire end date up to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Use facet / Promise.all for optimized count and paginated query
    const [total, doctors] = await Promise.all([
      Doctor.countDocuments(query),
      Doctor.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('patientCount')
        .lean({ virtuals: true }),
    ]);

    const pages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      success: true,
      count: doctors.length,
      pagination: {
        total,
        page,
        pages,
        limit,
        hasNext: page < pages,
        hasPrev: page > 1,
      },
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single doctor by ID with corresponding patients list
// @route   GET /api/doctors/:id
// @access  Private
exports.getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate({
        path: 'patients',
        options: { sort: { createdAt: -1 } },
      })
      .populate('patientCount');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: `Doctor not found with id ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new doctor
// @route   POST /api/doctors
// @access  Private
exports.createDoctor = async (req, res, next) => {
  try {
    const { name, specialization, hospital, phone, email, experienceYears, status } = req.body;

    // Check if doctor email already registered
    const existing = await Doctor.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A doctor with this email address already exists',
      });
    }

    const doctor = await Doctor.create({
      name,
      specialization,
      hospital,
      phone,
      email: email.toLowerCase().trim(),
      experienceYears: experienceYears || 1,
      status: status || 'Active',
    });

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor details
// @route   PUT /api/doctors/:id
// @access  Private
exports.updateDoctor = async (req, res, next) => {
  try {
    let doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: `Doctor not found with id ${req.params.id}`,
      });
    }

    // If updating email, ensure it doesn't collide with another doctor
    if (req.body.email && req.body.email.toLowerCase() !== doctor.email) {
      const emailExists = await Doctor.findOne({
        email: req.body.email.toLowerCase(),
        _id: { $ne: req.params.id },
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'This email is already in use by another doctor',
        });
      }
    }

    doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Doctor updated successfully',
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete doctor and handle associated patients
// @route   DELETE /api/doctors/:id
// @access  Private
exports.deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: `Doctor not found with id ${req.params.id}`,
      });
    }

    // Delete or cascade patients
    await Patient.deleteMany({ doctor: req.params.id });
    await doctor.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Doctor and associated patient records deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new patient under a specific doctor
// @route   POST /api/doctors/:id/patients
// @access  Private
exports.addPatientToDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: `Doctor not found with id ${req.params.id}`,
      });
    }

    const { name, age, gender, condition, phone, email, status, notes, admissionDate } = req.body;

    const patient = await Patient.create({
      name,
      age,
      gender,
      condition,
      phone,
      email: email || '',
      doctor: req.params.id,
      status: status || 'Active',
      admissionDate: admissionDate || Date.now(),
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: `Patient assigned to Dr. ${doctor.name} successfully`,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a patient from doctor's patient list
// @route   DELETE /api/doctors/:id/patients/:patientId
// @access  Private
exports.deletePatientFromDoctor = async (req, res, next) => {
  try {
    const { id: doctorId, patientId } = req.params;

    const patient = await Patient.findOne({ _id: patientId, doctor: doctorId });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient not found under this doctor's list`,
      });
    }

    await patient.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Patient removed from doctor list successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get specializations and hospitals list for filter dropdowns
// @route   GET /api/doctors/filters
// @access  Private
exports.getDoctorFilterOptions = async (req, res, next) => {
  try {
    const [specializations, hospitals] = await Promise.all([
      Doctor.distinct('specialization'),
      Doctor.distinct('hospital'),
    ]);

    res.status(200).json({
      success: true,
      data: {
        specializations: specializations.sort(),
        hospitals: hospitals.sort(),
      },
    });
  } catch (error) {
    next(error);
  }
};
