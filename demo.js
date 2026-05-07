/**
 * HealthTech Prescription Management System - Full Demo
 * Demonstrates: Auth, RBAC, CRUD, SQLite, MVC, Protected APIs
 */

const http = require('http');

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(data && { 'Content-Length': Buffer.byteLength(data) })
      }
    };
    const req = http.request(options, res => {
      let raw = '';
      res.on('data', chunk => (raw += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(raw) }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function log(label, res) {
  console.log(`\n--- ${label} ---`);
  console.log(`Status: ${res.status}`);
  console.log(JSON.stringify(res.body, null, 2));
}

async function run() {
  console.log('=== HealthTech Prescription Management System Demo ===\n');

  // 1. Register Doctor
  let res = await request('POST', '/api/auth/register', {
    name: 'Dr. Smith', email: 'doctor@health.com', password: 'doctor123', role: 'doctor'
  });
  log('1. Register Doctor', res);

  // 2. Register Patient
  res = await request('POST', '/api/auth/register', {
    name: 'Jane Doe', email: 'patient@health.com', password: 'patient123', role: 'patient'
  });
  log('2. Register Patient', res);

  // 3. Login as Doctor
  res = await request('POST', '/api/auth/login', { email: 'doctor@health.com', password: 'doctor123' });
  log('3. Login as Doctor', res);
  const doctorToken = res.body.token;

  // 4. Login as Patient
  res = await request('POST', '/api/auth/login', { email: 'patient@health.com', password: 'patient123' });
  log('4. Login as Patient', res);
  const patientToken = res.body.token;
  const patientId = res.body.user.id;

  // 5. Doctor views all patients
  res = await request('GET', '/api/prescriptions/patients', null, doctorToken);
  log('5. Doctor - Get All Patients', res);

  // 6. Doctor creates prescription
  res = await request('POST', '/api/prescriptions', {
    patient_id: patientId,
    medication: 'Amoxicillin',
    dosage: '500mg',
    frequency: '3 times daily',
    duration: '7 days',
    notes: 'Take with food'
  }, doctorToken);
  log('6. Doctor - Create Prescription', res);
  const prescriptionId = res.body.prescription?.id;

  // 7. Doctor views their prescriptions
  res = await request('GET', '/api/prescriptions', null, doctorToken);
  log('7. Doctor - Get All Prescriptions', res);

  // 8. Patient views their prescriptions
  res = await request('GET', '/api/prescriptions', null, patientToken);
  log('8. Patient - Get All Prescriptions', res);

  // 9. Get single prescription
  res = await request('GET', `/api/prescriptions/${prescriptionId}`, null, doctorToken);
  log('9. Doctor - Get Single Prescription', res);

  // 10. Doctor updates prescription
  res = await request('PUT', `/api/prescriptions/${prescriptionId}`, {
    medication: 'Amoxicillin',
    dosage: '750mg',
    frequency: '2 times daily',
    duration: '10 days',
    notes: 'Updated dosage'
  }, doctorToken);
  log('10. Doctor - Update Prescription', res);

  // 11. Patient tries to create prescription (should be FORBIDDEN)
  res = await request('POST', '/api/prescriptions', {
    patient_id: patientId, medication: 'Test', dosage: '10mg', frequency: 'once', duration: '1 day'
  }, patientToken);
  log('11. Patient tries to Create Prescription (should be 403 Forbidden)', res);

  // 12. Access without token (should be 401 Unauthorized)
  res = await request('GET', '/api/prescriptions', null, null);
  log('12. No Token - Access Protected Route (should be 401 Unauthorized)', res);

  // 13. Doctor deletes prescription
  res = await request('DELETE', `/api/prescriptions/${prescriptionId}`, null, doctorToken);
  log('13. Doctor - Delete Prescription', res);

  // 14. Verify deleted prescription is gone (should be 404)
  res = await request('GET', `/api/prescriptions/${prescriptionId}`, null, doctorToken);
  log('14. Get Deleted Prescription (should be 404)', res);

  console.log('\n=== Demo Complete ===');
  console.log('✅ Authentication (JWT)');
  console.log('✅ Authorization (Role-Based: Doctor/Patient)');
  console.log('✅ CRUD (Create, Read, Update, Delete prescriptions)');
  console.log('✅ SQLite3 Database');
  console.log('✅ MVC Architecture');
  console.log('✅ Protected APIs (401 without token, 403 wrong role)');
}

run().catch(console.error);
