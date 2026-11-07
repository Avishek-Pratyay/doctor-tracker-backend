const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// @desc    Get dashboard analytics, aggregation metrics, and visual chart data
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    // 1. High-level KPI metrics
    const [totalDoctors, totalPatients, activePatients, dischargedPatients] =
      await Promise.all([
        Doctor.countDocuments(),
        Patient.countDocuments(),
        Patient.countDocuments({ status: { $in: ['Active', 'In Treatment'] } }),
        Patient.countDocuments({ status: 'Discharged' }),
      ]);

    const avgPatientsPerDoctor =
      totalDoctors > 0 ? (totalPatients / totalDoctors).toFixed(1) : 0;

    // 2. Patients per Doctor Aggregation Pipeline
    const patientsPerDoctor = await Patient.aggregate([
      {
        $group: {
          _id: '$doctor',
          patientCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'doctors',
          localField: '_id',
          foreignField: '_id',
          as: 'doctorInfo',
        },
      },
      {
        $unwind: '$doctorInfo',
      },
      {
        $project: {
          _id: 1,
          doctorId: '$_id',
          doctorName: '$doctorInfo.name',
          specialization: '$doctorInfo.specialization',
          hospital: '$doctorInfo.hospital',
          patientCount: 1,
        },
      },
      {
        $sort: { patientCount: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // 3. Date-based statistics (Patient Admissions over time - grouped by month)
    const monthlyAdmissions = await Patient.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$admissionDate' },
          },
          admissions: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          admissions: 1,
        },
      },
    ]);

    // 4. Monthly Doctor Onboarding Trends
    const monthlyDoctors = await Doctor.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' },
          },
          doctors: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          doctors: 1,
        },
      },
    ]);

    // Merge monthly trends for unified time-series chart
    const trendMap = new Map();
    monthlyAdmissions.forEach((item) => {
      trendMap.set(item.month, {
        date: item.month,
        patients: item.admissions,
        doctors: 0,
      });
    });
    monthlyDoctors.forEach((item) => {
      if (trendMap.has(item.month)) {
        trendMap.get(item.month).doctors = item.doctors;
      } else {
        trendMap.set(item.month, {
          date: item.month,
          patients: 0,
          doctors: item.doctors,
        });
      }
    });

    const dateTrends = Array.from(trendMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    // 5. Condition Breakdown (for Pie/Donut Chart)
    const conditionDistribution = await Patient.aggregate([
      {
        $group: {
          _id: '$condition',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 7,
      },
      {
        $project: {
          _id: 0,
          condition: '$_id',
          count: 1,
        },
      },
    ]);

    // 6. Specialization Breakdown (for Bar / Radar Chart)
    const specializationDistribution = await Doctor.aggregate([
      {
        $group: {
          _id: '$specialization',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $project: {
          _id: 0,
          specialization: '$_id',
          count: 1,
        },
      },
    ]);

    // 7. Recent Activity (Latest 5 Doctors & 5 Patients)
    const [recentDoctors, recentPatients] = await Promise.all([
      Doctor.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name specialization hospital createdAt')
        .lean(),
      Patient.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('doctor', 'name')
        .select('name condition status admissionDate createdAt')
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        kpi: {
          totalDoctors,
          totalPatients,
          activePatients,
          dischargedPatients,
          avgPatientsPerDoctor: parseFloat(avgPatientsPerDoctor),
        },
        patientsPerDoctor,
        dateTrends,
        conditionDistribution,
        specializationDistribution,
        recentActivity: {
          doctors: recentDoctors,
          patients: recentPatients,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
