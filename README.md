# HealthTech Prescription Management System

A secure backend-driven prescription management system built with Node.js, Express.js, and SQLite3 following MVC architecture.

## Features

- **Role-Based Access Control**: Doctor and Patient roles with specific permissions
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **MVC Architecture**: Clean separation of concerns (Models, Views, Controllers)
- **RESTful API**: Standard HTTP methods for CRUD operations
- **SQLite3 Database**: Lightweight, file-based relational database

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3 (better-sqlite3)
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Architecture**: MVC Pattern

## Project Structure

```
├── src/
│   ├── config/
│   │   └── database.js          # Database connection & initialization
│   ├── models/
│   │   ├── userModel.js         # User data operations
│   │   └── prescriptionModel.js # Prescription data operations
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── prescriptionController.js # Prescription business logic
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   └── prescriptionRoutes.js # Prescription endpoints
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT & role authorization
│   └── server.js                # Express app entry point
├── schema & queries.sql         # Database schema & sample queries
├── package.json
└── README.md
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

Server will run on `http://localhost:3000`

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**: Returns JWT token to use in subsequent requests

### Prescriptions (Protected Routes)

**Note**: All prescription endpoints require `Authorization: Bearer <token>` header

#### Create Prescription (Doctor Only)
```http
POST /api/prescriptions
Authorization: Bearer <doctor_token>
Content-Type: application/json

{
  "patient_id": 1,
  "medication": "Amoxicillin",
  "dosage": "500mg",
  "frequency": "3 times daily",
  "duration": "7 days",
  "notes": "Take with food"
}
```

#### Get All Prescriptions
```http
GET /api/prescriptions
Authorization: Bearer <token>
```
- **Doctor**: Returns all prescriptions created by them
- **Patient**: Returns all prescriptions assigned to them

#### Get Single Prescription
```http
GET /api/prescriptions/:id
Authorization: Bearer <token>
```

#### Update Prescription (Doctor Only)
```http
PUT /api/prescriptions/:id
Authorization: Bearer <doctor_token>
Content-Type: application/json

{
  "medication": "Amoxicillin",
  "dosage": "750mg",
  "frequency": "2 times daily",
  "duration": "10 days",
  "notes": "Updated dosage"
}
```

#### Delete Prescription (Doctor Only)
```http
DELETE /api/prescriptions/:id
Authorization: Bearer <doctor_token>
```

#### Get All Patients (Doctor Only)
```http
GET /api/prescriptions/patients
Authorization: Bearer <doctor_token>
```

## Testing the Application

### Step 1: Register a Doctor
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Dr. Smith\",\"email\":\"doctor@health.com\",\"password\":\"doctor123\",\"role\":\"doctor\"}"
```

### Step 2: Register a Patient
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Jane Doe\",\"email\":\"patient@health.com\",\"password\":\"patient123\",\"role\":\"patient\"}"
```

### Step 3: Login as Doctor
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"doctor@health.com\",\"password\":\"doctor123\"}"
```
Save the returned token.

### Step 4: Create Prescription (as Doctor)
```bash
curl -X POST http://localhost:3000/api/prescriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <DOCTOR_TOKEN>" \
  -d "{\"patient_id\":2,\"medication\":\"Amoxicillin\",\"dosage\":\"500mg\",\"frequency\":\"3 times daily\",\"duration\":\"7 days\",\"notes\":\"Take with food\"}"
```

### Step 5: Login as Patient
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"patient@health.com\",\"password\":\"patient123\"}"
```

### Step 6: View Prescriptions (as Patient)
```bash
curl -X GET http://localhost:3000/api/prescriptions \
  -H "Authorization: Bearer <PATIENT_TOKEN>"
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Role-Based Authorization**: Middleware enforces permissions
- **SQL Injection Prevention**: Prepared statements
- **Input Validation**: Request validation on all endpoints

## Database Schema

### Users Table
- `id`: Primary key
- `name`: User's full name
- `email`: Unique email (login credential)
- `password`: Bcrypt hashed password
- `role`: 'doctor' or 'patient'
- `created_at`: Timestamp

### Prescriptions Table
- `id`: Primary key
- `patient_id`: Foreign key to users
- `doctor_id`: Foreign key to users
- `medication`: Medicine name
- `dosage`: Dosage amount
- `frequency`: How often to take
- `duration`: Treatment duration
- `notes`: Additional instructions
- `created_at`: Timestamp
- `updated_at`: Timestamp

## Authorization Rules

| Action | Doctor | Patient |
|--------|--------|---------|
| Create Prescription | ✅ | ❌ |
| View Own Prescriptions | ✅ | ✅ |
| Update Prescription | ✅ | ❌ |
| Delete Prescription | ✅ | ❌ |
| View All Patients | ✅ | ❌ |

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate email)
- `500`: Internal Server Error

## License

MIT
