const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
      index: true,
    },
    hospital: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
      index: true,
    },
    experienceYears: {
      type: Number,
      default: 1,
      min: [0, 'Experience years cannot be negative'],
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Inactive'],
      default: 'Active',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for patients belonging to this doctor
doctorSchema.virtual('patients', {
  ref: 'Patient',
  localField: '_id',
  foreignField: 'doctor',
  justOne: false,
});

// Virtual field for patient count
doctorSchema.virtual('patientCount', {
  ref: 'Patient',
  localField: '_id',
  foreignField: 'doctor',
  count: true,
});

// Full-text search index on doctor name, specialization, hospital, and email
doctorSchema.index({
  name: 'text',
  specialization: 'text',
  hospital: 'text',
  email: 'text',
});

// Compound index for date-wise sorting and filtering
doctorSchema.index({ createdAt: -1 });
doctorSchema.index({ specialization: 1, createdAt: -1 });

module.exports = mongoose.model('Doctor', doctorSchema);
