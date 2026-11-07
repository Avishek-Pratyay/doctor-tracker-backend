const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// @desc    Get all patients with search, filtering, and pagination
// @route   GET /api/patients
// @access  Private
exports.getPatients = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const {
      search,
      condition,
      status,
      gender,
      doctor,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query = {};

    // Search functionality (name, condition, phone, email)
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { condition: regex },
        { phone: regex },
        { email: regex },
      ];
    }

    // Filter by Condition
    if (condition && condition !== 'All') {
      query.condition = condition;
    }

    // Filter by Status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by Gender
    if (gender && gender !== 'All') {
      query.gender = gender;
    }

    // Filter by Doctor ID
    if (doctor && doctor !== 'All') {
      query.doctor = doctor;
    }

    // Date-wise filtering (by admissionDate or createdAt)
    if (startDate || endDate) {
      query.admissionDate = {};
      if (startDate) {
        query.admissionDate.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.admissionDate.$lte = end;
      }
    }

    // Dynamic sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute count and query concurrently
    const [total, patients] = await Promise.all([
      Patient.countDocuments(query),
      Patient.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('doctor', 'name specialization hospital email phone')
        .lean(),
    ]);

    const pages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      success: true,
      count: patients.length,
      pagination: {
        total,
        page,
        pages,
        limit,
        hasNext: page < pages,
        hasPrev: page > 1,
      },
      data: patients,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single patient by ID
// @route   GET /api/patients/:id
// @access  Private
exports.getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).populate(
      'doctor',
      'name specialization hospital email phone'
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient not found with id ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new patient
// @route   POST /api/patients
// @access  Private
exports.createPatient = async (req, res, next) => {
  try {
    const { name, age, gender, condition, phone, email, doctor, status, admissionDate, notes } =
      req.body;

    // Verify assigned doctor exists
    const doctorExists = await Doctor.findById(doctor);
    if (!doctorExists) {
      return res.status(400).json({
        success: false,
        message: 'The selected doctor does not exist',
      });
    }

    const patient = await Patient.create({
      name,
      age,
      gender,
      condition,
      phone,
      email: email || '',
      doctor,
      status: status || 'Active',
      admissionDate: admissionDate || Date.now(),
      notes: notes || '',
    });

    const populatedPatient = await Patient.findById(patient._id).populate(
      'doctor',
      'name specialization hospital'
    );

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: populatedPatient,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update patient information
// @route   PUT /api/patients/:id
// @access  Private
exports.updatePatient = async (req, res, next) => {
  try {
    let patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient not found with id ${req.params.id}`,
      });
    }

    if (req.body.doctor) {
      const docExists = await Doctor.findById(req.body.doctor);
      if (!docExists) {
        return res.status(400).json({
          success: false,
          message: 'The selected doctor does not exist',
        });
      }
    }

    patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('doctor', 'name specialization hospital');

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private
exports.deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient not found with id ${req.params.id}`,
      });
    }

    await patient.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get distinct conditions, statuses, and doctors for filters
// @route   GET /api/patients/filters
// @access  Private
exports.getPatientFilterOptions = async (req, res, next) => {
  try {
    const [conditions, statuses, doctors] = await Promise.all([
      Patient.distinct('condition'),
      Patient.distinct('status'),
      Doctor.find({}, 'name specialization hospital').lean(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        conditions: conditions.sort(),
        statuses: statuses.sort(),
        doctors: doctors.map((d) => ({
          id: d._id,
          name: d.name,
          specialization: d.specialization,
          hospital: d.hospital,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
