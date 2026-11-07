// In-memory data store for offline demo testing when local MongoDB is not yet started

let doctors = [
  {
    _id: 'doc-1',
    name: 'Dr. Sarah Jenkins',
    specialization: 'Cardiology',
    hospital: 'Johns Hopkins Hospital',
    phone: '+1 (555) 234-5678',
    email: 'sarah.jenkins@hospital.org',
    experienceYears: 14,
    status: 'Active',
    patientCount: 4,
    createdAt: new Date('2025-08-15'),
  },
  {
    _id: 'doc-2',
    name: 'Dr. Marcus Vance',
    specialization: 'Neurology',
    hospital: 'Mayo Clinic',
    phone: '+1 (555) 345-6789',
    email: 'marcus.vance@mayo.org',
    experienceYears: 18,
    status: 'Active',
    patientCount: 3,
    createdAt: new Date('2025-09-10'),
  },
  {
    _id: 'doc-3',
    name: 'Dr. Elena Rostova',
    specialization: 'Pediatrics',
    hospital: 'Boston Children’s Hospital',
    phone: '+1 (555) 456-7890',
    email: 'elena.rostova@childrens.org',
    experienceYears: 9,
    status: 'Active',
    patientCount: 3,
    createdAt: new Date('2025-10-05'),
  },
  {
    _id: 'doc-4',
    name: 'Dr. Robert Chen',
    specialization: 'Orthopedics',
    hospital: 'Cleveland Clinic',
    phone: '+1 (555) 567-8901',
    email: 'robert.chen@cleveland.org',
    experienceYears: 12,
    status: 'Active',
    patientCount: 3,
    createdAt: new Date('2025-11-20'),
  },
  {
    _id: 'doc-5',
    name: 'Dr. Amara Patel',
    specialization: 'Oncology',
    hospital: 'Memorial Sloan Kettering',
    phone: '+1 (555) 678-9012',
    email: 'amara.patel@mskcc.org',
    experienceYears: 16,
    status: 'Active',
    patientCount: 3,
    createdAt: new Date('2025-12-01'),
  },
  {
    _id: 'doc-6',
    name: 'Dr. David Kim',
    specialization: 'Dermatology',
    hospital: 'Mount Sinai Hospital',
    phone: '+1 (555) 789-0123',
    email: 'david.kim@mountsinai.org',
    experienceYears: 8,
    status: 'Active',
    patientCount: 2,
    createdAt: new Date('2026-01-12'),
  },
  {
    _id: 'doc-7',
    name: 'Dr. Olivia Thorne',
    specialization: 'Pulmonology',
    hospital: 'Massachusetts General Hospital',
    phone: '+1 (555) 890-1234',
    email: 'olivia.thorne@mgh.harvard.edu',
    experienceYears: 11,
    status: 'Active',
    patientCount: 2,
    createdAt: new Date('2026-02-18'),
  },
  {
    _id: 'doc-8',
    name: 'Dr. Tariq Al-Mansoor',
    specialization: 'Endocrinology',
    hospital: 'Stanford Health Care',
    phone: '+1 (555) 901-2345',
    email: 'tariq.mansoor@stanfordhealth.org',
    experienceYears: 15,
    status: 'Active',
    patientCount: 2,
    createdAt: new Date('2026-03-04'),
  },
  {
    _id: 'doc-9',
    name: 'Dr. Rachel Greenbaum',
    specialization: 'Gastroenterology',
    hospital: 'Cedars-Sinai Medical Center',
    phone: '+1 (555) 012-3456',
    email: 'rachel.greenbaum@csmc.edu',
    experienceYears: 13,
    status: 'Active',
    patientCount: 2,
    createdAt: new Date('2026-04-10'),
  },
  {
    _id: 'doc-10',
    name: 'Dr. James Wilson',
    specialization: 'General Surgery',
    hospital: 'Johns Hopkins Hospital',
    phone: '+1 (555) 123-4567',
    email: 'james.wilson@hospital.org',
    experienceYears: 20,
    status: 'Active',
    patientCount: 2,
    createdAt: new Date('2026-05-22'),
  },
];

let patients = [
  { _id: 'pat-1', name: 'Arthur Morgan', age: 48, gender: 'Male', condition: 'Hypertension', phone: '+1 (555) 987-1101', email: 'arthur.morgan@example.com', doctor: 'doc-1', status: 'Active', admissionDate: new Date('2025-11-05'), notes: 'Blood pressure stabilising with ACE inhibitors.' },
  { _id: 'pat-2', name: 'Beatrice Webb', age: 62, gender: 'Female', condition: 'Coronary Artery Disease', phone: '+1 (555) 987-1102', email: 'beatrice.webb@example.com', doctor: 'doc-1', status: 'In Treatment', admissionDate: new Date('2025-11-20'), notes: 'Scheduled for echocardiogram follow-up.' },
  { _id: 'pat-3', name: 'Charles Xavier', age: 55, gender: 'Male', condition: 'Arrhythmia', phone: '+1 (555) 987-1103', email: 'charles.xavier@example.com', doctor: 'doc-1', status: 'Active', admissionDate: new Date('2025-12-14'), notes: 'Holter monitor evaluation complete.' },
  { _id: 'pat-4', name: 'Uma Thurman', age: 52, gender: 'Female', condition: 'Hypertension', phone: '+1 (555) 987-1121', email: 'uma.thurman@example.com', doctor: 'doc-1', status: 'Active', admissionDate: new Date('2026-03-20'), notes: 'Routine checkup scheduled.' },
  { _id: 'pat-5', name: 'Diana Prince', age: 34, gender: 'Female', condition: 'Migraine with Aura', phone: '+1 (555) 987-1104', email: 'diana.prince@example.com', doctor: 'doc-2', status: 'Active', admissionDate: new Date('2025-10-18'), notes: 'Responded well to triptan therapy.' },
  { _id: 'pat-6', name: 'Ethan Hunt', age: 42, gender: 'Male', condition: 'Concussion', phone: '+1 (555) 987-1105', email: 'ethan.hunt@example.com', doctor: 'doc-2', status: 'Discharged', admissionDate: new Date('2026-02-10'), notes: 'Cognitive baseline restored.' },
  { _id: 'pat-7', name: 'Wanda Maximoff', age: 30, gender: 'Female', condition: 'Migraine with Aura', phone: '+1 (555) 987-1123', email: 'wanda.maximoff@example.com', doctor: 'doc-2', status: 'Active', admissionDate: new Date('2026-04-01'), notes: 'Trigger identification diary started.' },
  { _id: 'pat-8', name: 'Fiona Gallagher', age: 8, gender: 'Female', condition: 'Asthma', phone: '+1 (555) 987-1106', email: 'fiona.gallagher@example.com', doctor: 'doc-3', status: 'Active', admissionDate: new Date('2025-12-28'), notes: 'Maintenance inhaler refill provided.' },
  { _id: 'pat-9', name: 'George Miller', age: 5, gender: 'Male', condition: 'Type 1 Diabetes', phone: '+1 (555) 987-1107', email: 'george.miller@example.com', doctor: 'doc-3', status: 'In Treatment', admissionDate: new Date('2026-01-15'), notes: 'Continuous glucose monitor fitted.' },
  { _id: 'pat-10', name: 'Hannah Abbott', age: 29, gender: 'Female', condition: 'ACL Tear', phone: '+1 (555) 987-1108', email: 'hannah.abbott@example.com', doctor: 'doc-4', status: 'In Treatment', admissionDate: new Date('2026-02-05'), notes: 'Post-operative physical therapy.' },
  { _id: 'pat-11', name: 'Ian Malcolm', age: 51, gender: 'Male', condition: 'Knee Osteoarthritis', phone: '+1 (555) 987-1109', email: 'ian.malcolm@example.com', doctor: 'doc-4', status: 'Active', admissionDate: new Date('2025-09-30'), notes: 'Hyaluronic acid injection given.' },
  { _id: 'pat-12', name: 'Victor Stone', age: 27, gender: 'Male', condition: 'Fracture of Radius', phone: '+1 (555) 987-1122', email: 'victor.stone@example.com', doctor: 'doc-4', status: 'In Treatment', admissionDate: new Date('2026-03-25'), notes: 'Cast applied, 4 weeks immobility.' },
  { _id: 'pat-13', name: 'Julia Roberts', age: 59, gender: 'Female', condition: 'Breast Neoplasm', phone: '+1 (555) 987-1110', email: 'julia.roberts@example.com', doctor: 'doc-5', status: 'In Treatment', admissionDate: new Date('2025-11-12'), notes: 'Cycle 3 chemotherapy initiated.' },
  { _id: 'pat-14', name: 'Kevin Bacon', age: 66, gender: 'Male', condition: 'Lymphoma', phone: '+1 (555) 987-1111', email: 'kevin.bacon@example.com', doctor: 'doc-5', status: 'Active', admissionDate: new Date('2026-01-08'), notes: 'PET scan showed marked reduction.' },
  { _id: 'pat-15', name: 'Laura Croft', age: 31, gender: 'Female', condition: 'Severe Eczema', phone: '+1 (555) 987-1112', email: 'laura.croft@example.com', doctor: 'doc-6', status: 'Active', admissionDate: new Date('2026-02-22'), notes: 'Topical corticosteroid protocol.' },
  { _id: 'pat-16', name: 'Michael Scott', age: 44, gender: 'Male', condition: 'Melanoma', phone: '+1 (555) 987-1113', email: 'michael.scott@example.com', doctor: 'doc-6', status: 'Discharged', admissionDate: new Date('2025-12-10'), notes: 'Excision biopsy margins clear.' },
  { _id: 'pat-17', name: 'Nancy Wheeler', age: 24, gender: 'Female', condition: 'Chronic Bronchitis', phone: '+1 (555) 987-1114', email: 'nancy.wheeler@example.com', doctor: 'doc-7', status: 'Active', admissionDate: new Date('2026-01-20'), notes: 'Spirometry test shows improvement.' },
  { _id: 'pat-18', name: 'Oscar Martinez', age: 39, gender: 'Male', condition: 'Pneumonia', phone: '+1 (555) 987-1115', email: 'oscar.martinez@example.com', doctor: 'doc-7', status: 'Discharged', admissionDate: new Date('2026-03-01'), notes: 'Antibiotic course completed.' },
  { _id: 'pat-19', name: 'Pam Beesly', age: 33, gender: 'Female', condition: 'Hypothyroidism', phone: '+1 (555) 987-1116', email: 'pam.beesly@example.com', doctor: 'doc-8', status: 'Active', admissionDate: new Date('2025-10-10'), notes: 'Levothyroxine adjusted to 75mcg.' },
  { _id: 'pat-20', name: 'Quentin Coldwater', age: 28, gender: 'Male', condition: 'Type 2 Diabetes', phone: '+1 (555) 987-1117', email: 'quentin.coldwater@example.com', doctor: 'doc-8', status: 'Active', admissionDate: new Date('2026-02-14'), notes: 'HbA1c lowered to 6.4%.' },
  { _id: 'pat-21', name: 'Rachel Zane', age: 32, gender: 'Female', condition: 'Crohn’s Disease', phone: '+1 (555) 987-1118', email: 'rachel.zane@example.com', doctor: 'doc-9', status: 'In Treatment', admissionDate: new Date('2025-11-25'), notes: 'Biologic therapy underway.' },
  { _id: 'pat-22', name: 'Steve Rogers', age: 98, gender: 'Male', condition: 'Gastritis', phone: '+1 (555) 987-1119', email: 'steve.rogers@example.com', doctor: 'doc-9', status: 'Active', admissionDate: new Date('2026-03-10'), notes: 'PPI therapy commenced.' },
  { _id: 'pat-23', name: 'Tony Stark', age: 50, gender: 'Male', condition: 'Acute Appendicitis', phone: '+1 (555) 987-1120', email: 'tony.stark@example.com', doctor: 'doc-10', status: 'Discharged', admissionDate: new Date('2026-03-15'), notes: 'Laparoscopic appendectomy successful.' },
  { _id: 'pat-24', name: 'Xander Cage', age: 46, gender: 'Male', condition: 'Asthma', phone: '+1 (555) 987-1124', email: 'xander.cage@example.com', doctor: 'doc-10', status: 'Active', admissionDate: new Date('2026-03-28'), notes: 'Cold-induced bronchospasm managed.' },
];

module.exports = {
  getDoctors: () => doctors,
  getPatients: () => patients,
  addDoctor: (doc) => {
    const newDoc = {
      _id: `doc-${Date.now()}`,
      ...doc,
      createdAt: new Date(),
      patientCount: 0,
    };
    doctors.unshift(newDoc);
    return newDoc;
  },
  updateDoctor: (id, data) => {
    const idx = doctors.findIndex((d) => d._id === id);
    if (idx !== -1) {
      doctors[idx] = { ...doctors[idx], ...data };
      return doctors[idx];
    }
    return null;
  },
  deleteDoctor: (id) => {
    doctors = doctors.filter((d) => d._id !== id);
    patients = patients.filter((p) => p.doctor !== id);
  },
  addPatient: (pat) => {
    const newPat = {
      _id: `pat-${Date.now()}`,
      ...pat,
      createdAt: new Date(),
      admissionDate: pat.admissionDate ? new Date(pat.admissionDate) : new Date(),
    };
    patients.unshift(newPat);
    const doc = doctors.find((d) => d._id === pat.doctor);
    if (doc) doc.patientCount = (doc.patientCount || 0) + 1;
    return newPat;
  },
  updatePatient: (id, data) => {
    const idx = patients.findIndex((p) => p._id === id);
    if (idx !== -1) {
      patients[idx] = { ...patients[idx], ...data };
      return patients[idx];
    }
    return null;
  },
  deletePatient: (id) => {
    const pat = patients.find((p) => p._id === id);
    if (pat) {
      const doc = doctors.find((d) => d._id === pat.doctor);
      if (doc && doc.patientCount > 0) doc.patientCount -= 1;
    }
    patients = patients.filter((p) => p._id !== id);
  },
};
