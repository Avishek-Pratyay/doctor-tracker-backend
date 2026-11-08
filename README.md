# Doctor Tracker – Backend REST API

Standalone Node.js & Express RESTful API server for the Doctor Tracker administrative healthcare management system.

[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Mongoose-emerald.svg)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)

---

## 1. Description & Architecture

The **Doctor Tracker Backend** provides secure, high-performance RESTful API endpoints for managing medical physicians, assigning and tracking patient cohorts, and computing real-time clinical analytics.

- **Framework**: Express.js with Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT Bearer token authentication with bcryptjs password hashing
- **Security**: Helmet, express-rate-limit, input validation with express-validator
- **Optimization**: Compound text search indexes, date indexes, single-pass MongoDB aggregation pipelines

---

## 2. Links & Live Deployments

- **Frontend Live Website**: [https://doctor-tracker-frontend-phi.vercel.app](https://doctor-tracker-frontend-phi.vercel.app)
- **Frontend Repository**: [https://github.com/Avishek-Pratyay/doctor-tracker-frontend](https://github.com/Avishek-Pratyay/doctor-tracker-frontend)
- **Backend Repository**: [https://github.com/Avishek-Pratyay/doctor-tracker-backend](https://github.com/Avishek-Pratyay/doctor-tracker-backend)

### Demo Administrator Credentials
- **Email**: `admin@doctortracker.com`
- **Password**: `Admin@123456`

---

## 3. Local Installation & Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/Avishek-Pratyay/doctor-tracker-backend.git
cd doctor-tracker-backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
**`.env` Configuration:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://avishekpaiub_db_user:lGKb0z0o5P6KUo8e@cluster0.xnz65fv.mongodb.net/doctor_tracker?retryWrites=true&w=majority
JWT_SECRET=doctor_tracker_secure_jwt_secret_dev_key_2026
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Step 4: Seed Database
Populate your database with the initial administrator account, 10 doctors, and 24 patients:
```bash
npm run seed
```

### Step 5: Start Server
```bash
# Production mode:
npm start

# Development mode (nodemon):
npm run dev
```
The server will run on `http://localhost:5000`. Test via `http://localhost:5000/api/health`.

---

## 4. API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate admin & receive JWT | No |
| `GET` | `/api/auth/me` | Fetch active admin session profile | Yes |
| `GET` | `/api/doctors` | Paginated, searchable & filtered doctor list | Yes |
| `POST` | `/api/doctors` | Create a new doctor record | Yes |
| `GET` | `/api/doctors/:id` | Get single doctor with assigned patients | Yes |
| `PUT` | `/api/doctors/:id` | Update doctor details | Yes |
| `DELETE`| `/api/doctors/:id` | Delete doctor and handle patient records | Yes |
| `POST` | `/api/doctors/:id/patients` | Add patient directly under a doctor | Yes |
| `DELETE`| `/api/doctors/:id/patients/:pid` | Delete patient from doctor's list | Yes |
| `GET` | `/api/patients` | Dedicated patient list (search/filter/paginate) | Yes |
| `POST` | `/api/patients` | Register new patient with assigned doctor | Yes |
| `PUT` | `/api/patients/:id` | Update patient record & clinical status | Yes |
| `DELETE`| `/api/patients/:id` | Permanently remove patient record | Yes |
| `GET` | `/api/analytics/dashboard`| MongoDB aggregation KPIs & chart data | Yes |
| `GET` | `/api/health` | Service uptime and MongoDB connection health | No |
