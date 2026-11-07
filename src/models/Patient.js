const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [0, 'Age must be positive'],
      max: [130, 'Age is out of realistic range'],
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['Male', 'Female', 'Other'],
      default: 'Male',
    },
    condition: {
      type: String,
      required: [true, 'Patient medical condition / diagnosis is required'],
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Assigned doctor is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['Active', 'In Treatment', 'Discharged', 'Critical'],
      default: 'Active',
      index: true,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Full-text search index
patientSchema.index({
  name: 'text',
  condition: 'text',
  phone: 'text',
});

// Compound indexes for rapid filtering, pagination, and sorting
patientSchema.index({ doctor: 1, createdAt: -1 });
patientSchema.index({ condition: 1, createdAt: -1 });
patientSchema.index({ status: 1, createdAt: -1 });
patientSchema.index({ admissionDate: -1 });
patientSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Patient', patientSchema);
