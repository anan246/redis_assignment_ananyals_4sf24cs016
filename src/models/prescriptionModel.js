const db = require('../config/database');

const PrescriptionModel = {
  async create({ patient_id, doctor_id, medication, dosage, frequency, duration, notes }) {
    const result = await db.asyncRun(
      'INSERT INTO prescriptions (patient_id, doctor_id, medication, dosage, frequency, duration, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [patient_id, doctor_id, medication, dosage, frequency, duration, notes || null]
    );
    return await this.findById(result.lastID);
  },

  async findById(id) {
    return await db.asyncGet(`
      SELECT p.*,
             patient.name  AS patient_name, patient.email AS patient_email,
             doctor.name   AS doctor_name,  doctor.email  AS doctor_email
      FROM prescriptions p
      JOIN users patient ON p.patient_id = patient.id
      JOIN users doctor  ON p.doctor_id  = doctor.id
      WHERE p.id = ?
    `, [id]);
  },

  async findByDoctor(doctor_id) {
    return await db.asyncAll(`
      SELECT p.*, u.name AS patient_name, u.email AS patient_email
      FROM prescriptions p
      JOIN users u ON p.patient_id = u.id
      WHERE p.doctor_id = ?
      ORDER BY p.created_at DESC
    `, [doctor_id]);
  },

  async findByPatient(patient_id) {
    return await db.asyncAll(`
      SELECT p.*, d.name AS doctor_name, d.email AS doctor_email
      FROM prescriptions p
      JOIN users d ON p.doctor_id = d.id
      WHERE p.patient_id = ?
      ORDER BY p.created_at DESC
    `, [patient_id]);
  },

  async update(id, doctor_id, { medication, dosage, frequency, duration, notes }) {
    const result = await db.asyncRun(`
      UPDATE prescriptions
      SET medication = ?, dosage = ?, frequency = ?, duration = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND doctor_id = ?
    `, [medication, dosage, frequency, duration, notes || null, id, doctor_id]);

    if (result.changes === 0) return null;
    return await this.findById(id);
  },

  async delete(id, doctor_id) {
    const result = await db.asyncRun('DELETE FROM prescriptions WHERE id = ? AND doctor_id = ?', [id, doctor_id]);
    return result.changes > 0;
  }
};

module.exports = PrescriptionModel;
