const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const mockData = require('../mockData');

// @desc    Get dashboard analytics, aggregation metrics, and visual chart data
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    // If MongoDB is not connected, use in-memory store for seamless demo
    if (mongoose.connection.readyState !== 1) {
      const doctors = mockData.getDoctors();
      const patients = mockData.getPatients();

      const totalDoctors = doctors.length;
      const totalPatients = patients.length;
      const activePatients = patients.filter((p) =>
        ['Active', 'In Treatment'].includes(p.status)
      ).length;
      const dischargedPatients = patients.filter((p) => p.status === 'Discharged').length;
      const avgPatientsPerDoctor =
        totalDoctors > 0 ? (totalPatients / totalDoctors).toFixed(1) : 0;

      // Patients per doctor
      const patientsPerDoctor = doctors.map((doc) => {
        const count = patients.filter((p) => p.doctor === doc._id).length;
        return {
          doctorId: doc._id,
          doctorName: doc.name,
          specialization: doc.specialization,
          hospital: doc.hospital,
          patientCount: count,
        };
      }).sort((a, b) => b.patientCount - a.patientCount);

      // Date trends
      const trendMap = new Map();
      patients.forEach((p) => {
        const month = new Date(p.admissionDate).toISOString().slice(0, 7);
        trendMap.set(month, (trendMap.get(month) || 0) + 1);
      });
      const dateTrends = Array.from(trendMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, count]) => ({ date, patients: count, doctors: 1 }));

      // Condition distribution
      const condMap = new Map();
      patients.forEach((p) => {
        condMap.set(p.condition, (condMap.get(p.condition) || 0) + 1);
      });
      const conditionDistribution = Array.from(condMap.entries())
        .map(([condition, count]) => ({ condition, count }))
        .sort((a, b) => b.count - a.count);

      // Specialization distribution
      const specMap = new Map();
      doctors.forEach((d) => {
        specMap.set(d.specialization, (specMap.get(d.specialization) || 0) + 1);
      });
      const specializationDistribution = Array.from(specMap.entries())
        .map(([specialization, count]) => ({ specialization, count }))
        .sort((a, b) => b.count - a.count);

      return res.status(200).json({
        success: true,
        data: {
          kpi: {
            totalDoctors,
            totalPatients,
            activePatients,
            dischargedPatients,
            avgPatientsPerDoctor: parseFloat(avgPatientsPerDoctor),
          },
          patientsPerDoctor: patientsPerDoctor.slice(0, 8),
          dateTrends,
          conditionDistribution: conditionDistribution.slice(0, 6),
          specializationDistribution,
          recentActivity: {
            doctors: doctors.slice(0, 5),
            patients: patients.slice(0, 5).map((p) => {
              const d = doctors.find((doc) => doc._id === p.doctor);
              return { ...p, doctor: { name: d ? d.name : 'Attending' } };
            }),
          },
        },
      });
    }

    // 1. High-level KPI metrics via Mongoose
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

    // 3. Date-based statistics (Monthly admissions)
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

    // 5. Condition Breakdown
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

    // 6. Specialization Breakdown
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

    // 7. Recent Activity
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
