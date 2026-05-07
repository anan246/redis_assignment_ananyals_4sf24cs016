-- HealthTech Prescription Management System
-- Database Schema and Queries

-- ============================================
-- TABLE CREATION
-- ============================================

-- Users Table (for both Doctors and Patients)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('doctor', 'patient')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Prescriptions Table
CREATE TABLE IF NOT EXISTS prescriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    medication TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    duration TEXT NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor ON prescriptions(doctor_id);

-- ============================================
-- SAMPLE QUERIES
-- ============================================

-- Register a new user (patient or doctor)
-- INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?);

-- Find user by email (for login)
-- SELECT * FROM users WHERE email = ?;

-- Create a new prescription (Doctor only)
-- INSERT INTO prescriptions (patient_id, doctor_id, medication, dosage, frequency, duration, notes) 
-- VALUES (?, ?, ?, ?, ?, ?, ?);

-- Get all prescriptions created by a specific doctor
-- SELECT p.*, u.name as patient_name, u.email as patient_email 
-- FROM prescriptions p 
-- JOIN users u ON p.patient_id = u.id 
-- WHERE p.doctor_id = ?;

-- Get all prescriptions for a specific patient
-- SELECT p.*, d.name as doctor_name, d.email as doctor_email 
-- FROM prescriptions p 
-- JOIN users d ON p.doctor_id = d.id 
-- WHERE p.patient_id = ?;

-- Get a specific prescription by ID
-- SELECT p.*, 
--        patient.name as patient_name, patient.email as patient_email,
--        doctor.name as doctor_name, doctor.email as doctor_email
-- FROM prescriptions p
-- JOIN users patient ON p.patient_id = patient.id
-- JOIN users doctor ON p.doctor_id = doctor.id
-- WHERE p.id = ?;

-- Update a prescription (Doctor only)
-- UPDATE prescriptions 
-- SET medication = ?, dosage = ?, frequency = ?, duration = ?, notes = ?, updated_at = CURRENT_TIMESTAMP 
-- WHERE id = ? AND doctor_id = ?;

-- Delete a prescription (Doctor only)
-- DELETE FROM prescriptions WHERE id = ? AND doctor_id = ?;

-- Get all patients (for doctor to select when creating prescription)
-- SELECT id, name, email FROM users WHERE role = 'patient';

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Sample Doctor (password: doctor123)
-- INSERT INTO users (name, email, password, role) 
-- VALUES ('Dr. John Smith', 'doctor@health.com', '$2a$10$hashedpassword', 'doctor');

-- Sample Patient (password: patient123)
-- INSERT INTO users (name, email, password, role) 
-- VALUES ('Jane Doe', 'patient@health.com', '$2a$10$hashedpassword', 'patient');
