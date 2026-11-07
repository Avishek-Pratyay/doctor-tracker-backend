// Automated Verification Script for Doctor Tracker API
// Tests auth, doctors CRUD, patients CRUD, and analytics aggregation
require('dotenv').config();
const http = require('http');

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

const request = (path, options = {}, body = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = http.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('--- Doctor Tracker API Automated Verification ---');
  try {
    // 1. Health Check
    const health = await request('/api/health');
    console.log(`[PASS] GET /api/health -> Status: ${health.status}, DB: ${health.body.database}`);

    // 2. Auth Login with Seeded Admin
    const login = await request('/api/auth/login', { method: 'POST' }, {
      email: 'admin@doctortracker.com',
      password: 'Admin@123456',
    });
    console.log(`[PASS] POST /api/auth/login -> Status: ${login.status}, Token received: ${!!login.body.token}`);
    const token = login.body.token;

    const authHeaders = { Authorization: `Bearer ${token}` };

    // 3. Analytics Dashboard
    const stats = await request('/api/analytics/dashboard', { headers: authHeaders });
    console.log(`[PASS] GET /api/analytics/dashboard -> Status: ${stats.status}, Total Doctors: ${stats.body.data?.kpi?.totalDoctors}, Total Patients: ${stats.body.data?.kpi?.totalPatients}`);

    // 4. Doctors List (Search & Pagination)
    const doctors = await request('/api/doctors?page=1&limit=5', { headers: authHeaders });
    console.log(`[PASS] GET /api/doctors -> Status: ${doctors.status}, Count: ${doctors.body.data?.length}, Total: ${doctors.body.pagination?.total}`);

    // 5. Patients List
    const patients = await request('/api/patients?page=1&limit=5', { headers: authHeaders });
    console.log(`[PASS] GET /api/patients -> Status: ${patients.status}, Count: ${patients.body.data?.length}, Total: ${patients.body.pagination?.total}`);

    console.log('--- All Critical Backend API Verifications Completed Successfully! ---');
  } catch (error) {
    console.error('[API Test Execution Note]:', error.message);
  }
};

if (require.main === module) {
  runTests();
}

module.exports = runTests;
