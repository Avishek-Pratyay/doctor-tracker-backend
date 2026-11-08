# Doctor Tracker — Backend API

> RESTful API server for the Doctor Tracker healthcare management system.  
> **Node.js · Express · MongoDB Atlas · JWT Authentication**

---

## 🔗 Live

| Resource | URL |
|---|---|
| **API Base URL** | `https://doctor-tracker-backend.onrender.com` |
| **Health Check** | `https://doctor-tracker-backend.onrender.com/api/health` |
| **Frontend** | `https://doctor-tracker-frontend-phi.vercel.app` |

---

## ⚡ Quick Start

```bash
git clone https://github.com/Avishek-Pratyay/doctor-tracker-backend.git
cd doctor-tracker-backend
npm install
cp .env.example .env     # fill in your values
npm run seed             # seed MongoDB with sample data
npm run dev              # start dev server on :5000
```

---

## 🌍 Environment Variables

Create a `.env` file in the backend root:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/doctor_tracker?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRE=7d
```

---

## 📡 API Reference

### Auth

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | `{ email, password }` | Returns JWT token |
| `GET` | `/api/health` | — | Server & DB status |

### Doctors (all require `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/doctors` | List (search, filter, paginate) |
| `GET` | `/api/doctors/filters` | Available filter options |
| `GET` | `/api/doctors/:id` | Single doctor |
| `POST` | `/api/doctors` | Create doctor |
| `PUT` | `/api/doctors/:id` | Update doctor |
| `DELETE` | `/api/doctors/:id` | Delete doctor |
| `POST` | `/api/doctors/:id/patients` | Assign patient to doctor |
| `DELETE` | `/api/doctors/:id/patients/:patientId` | Remove patient from doctor |

### Patients (all require JWT)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/patients` | List (search, filter, paginate) |
| `GET` | `/api/patients/filters` | Available filter options |
| `GET` | `/api/patients/:id` | Single patient |
| `POST` | `/api/patients` | Create patient |
| `PUT` | `/api/patients/:id` | Update patient |
| `DELETE` | `/api/patients/:id` | Delete patient |

### Analytics (requires JWT)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/dashboard` | KPIs, charts, aggregation data |

#### Common Query Parameters

```
?search=cardiology     # full-text search
?page=1&limit=10       # pagination
?specialization=X      # filter by specialization
?status=Active         # filter by status
?startDate=2024-01-01  # date range start
?endDate=2024-12-31    # date range end
?sort=-createdAt       # sort (prefix - for descending)
```

---

## 🔐 Security Features

| Feature | Implementation |
|---|---|
| **Password Hashing** | bcryptjs (12 salt rounds) |
| **Authentication** | JWT, 7-day expiry, middleware-enforced |
| **Security Headers** | Helmet.js (11 HTTP headers) |
| **Rate Limiting** | 1000 req/15min global, 30 req/15min on `/api/auth/login` |
| **Input Validation** | express-validator on all POST/PUT endpoints |
| **Request Size Limit** | 10kb JSON body limit |
| **CORS** | Configured for Vercel frontend |
| **Compression** | gzip via compression middleware |

---

## 🗄 Data Models

### Doctor
```
name, specialization, hospital, phone, email, experienceYears, status
Virtuals: patients[], patientCount
Text index: name, specialization, hospital, email
```

### Patient
```
name, age, gender, condition, phone, email, doctor (ref), status, admissionDate, notes
Text index: name, condition, phone
Compound indexes: (doctor, createdAt), (status, createdAt), admissionDate
```

### User
```
name, email, password (hashed), role (admin|user)
```

---

## 🧪 Scripts

| Script | Command | Description |
|---|---|---|
| Start production | `npm start` | `node src/server.js` |
| Start development | `npm run dev` | `nodemon src/server.js` |
| Seed database | `npm run seed` | Seeds 10 doctors, 24 patients, 1 admin |
| Run API tests | `npm test` | Automated verification of all endpoints |

---

## 📁 Source Structure

```
src/
├── config/db.js              # MongoDB connection
├── controllers/
│   ├── authController.js
│   ├── doctorController.js
│   ├── patientController.js
│   └── analyticsController.js
├── middleware/
│   ├── auth.js               # JWT protect middleware
│   ├── errorHandler.js       # Centralized error handler
│   └── validator.js          # Input validation rules
├── models/
│   ├── User.js
│   ├── Doctor.js
│   └── Patient.js
├── routes/
│   ├── authRoutes.js
│   ├── doctorRoutes.js
│   ├── patientRoutes.js
│   └── analyticsRoutes.js
├── mockData.js               # In-memory fallback data
├── seed.js                   # Database seeder
├── test-api.js               # API test suite
└── server.js                 # App entry point
```
