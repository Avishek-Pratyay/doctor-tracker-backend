require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');

const sampleDoctors = [
  {
    name: 'Dr. Sarah Jenkins',
    specialization: 'Cardiology',
    hospital: 'Johns Hopkins Hospital',
    phone: '+1 (555) 234-5678',
    email: 'sarah.jenkins@hospital.org',
    experienceYears: 14,
    status: 'Active',
    createdAt: new Date('2025-08-15'),
  },
  {
    name: 'Dr. Marcus Vance',
    specialization: 'Neurology',
    hospital: 'Mayo Clinic',
    phone: '+1 (555) 345-6789',
    email: 'marcus.vance@mayo.org',
    experienceYears: 18,
    status: 'Active',
    createdAt: new Date('2025-09-10'),
  },
  {
    name: 'Dr. Elena Rostova',
    specialization: 'Pediatrics',
    hospital: 'Boston Children’s Hospital',
    phone: '+1 (555) 456-7890',
    email: 'elena.rostova@childrens.org',
    experienceYears: 9,
    status: 'Active',
    createdAt: new Date('2025-10-05'),
  },
  {
    name: 'Dr. Robert Chen',
    specialization: 'Orthopedics',
    hospital: 'Cleveland Clinic',
    phone: '+1 (555) 567-8901',
    email: 'robert.chen@cleveland.org',
    experienceYears: 12,
    status: 'Active',
    createdAt: new Date('2025-11-20'),
  },
  {
    name: 'Dr. Amara Patel',
    specialization: 'Oncology',
    hospital: 'Memorial Sloan Kettering',
    phone: '+1 (555) 678-9012',
    email: 'amara.patel@mskcc.org',
    experienceYears: 16,
    status: 'Active',
    createdAt: new Date('2025-12-01'),
  },
  {
    name: 'Dr. David Kim',
    specialization: 'Dermatology',
    hospital: 'Mount Sinai Hospital',
    phone: '+1 (555) 789-0123',
    email: 'david.kim@mountsinai.org',
    experienceYears: 8,
    status: 'Active',
    createdAt: new Date('2026-01-12'),
  },
  {
    name: 'Dr. Olivia Thorne',
    specialization: 'Pulmonology',
    hospital: 'Massachusetts General Hospital',
    phone: '+1 (555) 890-1234',
    email: 'olivia.thorne@mgh.harvard.edu',
    experienceYears: 11,
    status: 'Active',
    createdAt: new Date('2026-02-18'),
  },
  {
    name: 'Dr. Tariq Al-Mansoor',
    specialization: 'Endocrinology',
    hospital: 'Stanford Health Care',
    phone: '+1 (555) 901-2345',
    email: 'tariq.mansoor@stanfordhealth.org',
    experienceYears: 15,
    status: 'Active',
    createdAt: new Date('2026-03-04'),
  },
  {
    name: 'Dr. Rachel Greenbaum',
    specialization: 'Gastroenterology',
    hospital: 'Cedars-Sinai Medical Center',
    phone: '+1 (555) 012-3456',
    email: 'rachel.greenbaum@csmc.edu',
    experienceYears: 13,
    status: 'Active',
    createdAt: new Date('2026-04-10'),
  },
  {
    name: 'Dr. James Wilson',
    specialization: 'General Surgery',
    hospital: 'Johns Hopkins Hospital',
    phone: '+1 (555) 123-4567',
    email: 'james.wilson@hospital.org',
    experienceYears: 20,
    status: 'Active',
    createdAt: new Date('2026-05-22'),
  },
];

const patientDataTemplates = [
  { name: 'Arthur Morgan', age: 48, gender: 'Male', condition: 'Hypertension', phone: '+1 (555) 987-1101', status: 'Active', daysAgo: 120, notes: 'Blood pressure stabilising with ACE inhibitors.' },
  { name: 'Beatrice Webb', age: 62, gender: 'Female', condition: 'Coronary Artery Disease', phone: '+1 (555) 987-1102', status: 'In Treatment', daysAgo: 95, notes: 'Scheduled for echocardiogram follow-up.' },
  { name: 'Charles Xavier', age: 55, gender: 'Male', condition: 'Arrhythmia', phone: '+1 (555) 987-1103', status: 'Active', daysAgo: 70, notes: 'Holter monitor evaluation complete.' },
  { name: 'Diana Prince', age: 34, gender: 'Female', condition: 'Migraine with Aura', phone: '+1 (555) 987-1104', status: 'Active', daysAgo: 110, notes: 'Responded well to triptan therapy.' },
  { name: 'Ethan Hunt', age: 42, gender: 'Male', condition: 'Concussion', phone: '+1 (555) 987-1105', status: 'Discharged', daysAgo: 45, notes: 'Cognitive baseline restored.' },
  { name: 'Fiona Gallagher', age: 8, gender: 'Female', condition: 'Asthma', phone: '+1 (555) 987-1106', status: 'Active', daysAgo: 85, notes: 'Maintenance inhaler refill provided.' },
  { name: 'George Miller', age: 5, gender: 'Male', condition: 'Type 1 Diabetes', phone: '+1 (555) 987-1107', status: 'In Treatment', daysAgo: 60, notes: 'Continuous glucose monitor fitted.' },
  { name: 'Hannah Abbott', age: 29, gender: 'Female', condition: 'ACL Tear', phone: '+1 (555) 987-1108', status: 'In Treatment', daysAgo: 40, notes: 'Post-operative physical therapy.' },
  { name: 'Ian Malcolm', age: 51, gender: 'Male', condition: 'Knee Osteoarthritis', phone: '+1 (555) 987-1109', status: 'Active', daysAgo: 130, notes: 'Hyaluronic acid injection given.' },
  { name: 'Julia Roberts', age: 59, gender: 'Female', condition: 'Breast Neoplasm', phone: '+1 (555) 987-1110', status: 'In Treatment', daysAgo: 100, notes: 'Cycle 3 chemotherapy initiated.' },
  { name: 'Kevin Bacon', age: 66, gender: 'Male', condition: 'Lymphoma', phone: '+1 (555) 987-1111', status: 'Active', daysAgo: 75, notes: 'PET scan showed marked reduction.' },
  { name: 'Laura Croft', age: 31, gender: 'Female', condition: 'Severe Eczema', phone: '+1 (555) 987-1112', status: 'Active', daysAgo: 50, notes: 'Topical corticosteroid protocol.' },
  { name: 'Michael Scott', age: 44, gender: 'Male', condition: 'Melanoma', phone: '+1 (555) 987-1113', status: 'Discharged', daysAgo: 90, notes: 'Excision biopsy margins clear.' },
  { name: 'Nancy Wheeler', age: 24, gender: 'Female', condition: 'Chronic Bronchitis', phone: '+1 (555) 987-1114', status: 'Active', daysAgo: 65, notes: 'Spirometry test shows improvement.' },
  { name: 'Oscar Martinez', age: 39, gender: 'Male', condition: 'Pneumonia', phone: '+1 (555) 987-1115', status: 'Discharged', daysAgo: 25, notes: 'Antibiotic course completed.' },
  { name: 'Pam Beesly', age: 33, gender: 'Female', condition: 'Hypothyroidism', phone: '+1 (555) 987-1116', status: 'Active', daysAgo: 140, notes: 'Levothyroxine adjusted to 75mcg.' },
  { name: 'Quentin Coldwater', age: 28, gender: 'Male', condition: 'Type 2 Diabetes', phone: '+1 (555) 987-1117', status: 'Active', daysAgo: 80, notes: 'HbA1c lowered to 6.4%.' },
  { name: 'Rachel Zane', age: 32, gender: 'Female', condition: 'Crohn’s Disease', phone: '+1 (555) 987-1118', status: 'In Treatment', daysAgo: 115, notes: 'Biologic therapy underway.' },
  { name: 'Steve Rogers', age: 98, gender: 'Male', condition: 'Gastritis', phone: '+1 (555) 987-1119', status: 'Active', daysAgo: 35, notes: 'PPI therapy commenced.' },
  { name: 'Tony Stark', age: 50, gender: 'Male', condition: 'Acute Appendicitis', phone: '+1 (555) 987-1120', status: 'Discharged', daysAgo: 20, notes: 'Laparoscopic appendectomy successful.' },
  { name: 'Uma Thurman', age: 52, gender: 'Female', condition: 'Hypertension', phone: '+1 (555) 987-1121', status: 'Active', daysAgo: 15, notes: 'Routine checkup scheduled.' },
  { name: 'Victor Stone', age: 27, gender: 'Male', condition: 'Fracture of Radius', phone: '+1 (555) 987-1122', status: 'In Treatment', daysAgo: 10, notes: 'Cast applied, 4 weeks immobility.' },
  { name: 'Wanda Maximoff', age: 30, gender: 'Female', condition: 'Migraine with Aura', phone: '+1 (555) 987-1123', status: 'Active', daysAgo: 5, notes: 'Trigger identification diary started.' },
  { name: 'Xander Cage', age: 46, gender: 'Male', condition: 'Asthma', phone: '+1 (555) 987-1124', status: 'Active', daysAgo: 12, notes: 'Cold-induced bronchospasm managed.' },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/doctor_tracker';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Doctor.deleteMany({}),
      Patient.deleteMany({}),
    ]);
    console.log('[Seed] Cleared existing records');

    // 1. Seed Admin User
    const adminUser = await User.create({
      name: 'Dr. Admin Administrator',
      email: 'admin@doctortracker.com',
      password: 'Admin@123456',
      role: 'admin',
    });
    console.log(`[Seed] Admin user created: ${adminUser.email}`);

    // 2. Seed Doctors
    const createdDoctors = await Doctor.insertMany(sampleDoctors);
    console.log(`[Seed] Created ${createdDoctors.length} doctors`);

    // 3. Seed Patients assigned to Doctors
    const now = Date.now();
    const patientsToInsert = patientDataTemplates.map((template, idx) => {
      // Distribute patients across doctors
      const assignedDoctor = createdDoctors[idx % createdDoctors.length];
      const admissionTime = new Date(now - template.daysAgo * 24 * 60 * 60 * 1000);

      return {
        name: template.name,
        age: template.age,
        gender: template.gender,
        condition: template.condition,
        phone: template.phone,
        email: `${template.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@example.com`,
        doctor: assignedDoctor._id,
        status: template.status,
        admissionDate: admissionTime,
        notes: template.notes,
        createdAt: admissionTime,
      };
    });

    const createdPatients = await Patient.insertMany(patientsToInsert);
    console.log(`[Seed] Created ${createdPatients.length} patients with realistic history`);

    console.log('\n===============================================');
    console.log(' DATABASE SEEDED SUCCESSFULLY!');
    console.log(' Admin Login Credentials:');
    console.log('   Email:    admin@doctortracker.com');
    console.log('   Password: Admin@123456');
    console.log('===============================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
