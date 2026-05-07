const PrescriptionModel = require('../models/prescriptionModel');
const UserModel = require('../models/userModel');

const PrescriptionController = {
 
  async create(req, res) {
    try {
      const { patient_id, medication, dosage, frequency, duration, notes } = req.body;

      if (!patient_id || !medication || !dosage || !frequency || !duration) {
        return res.status(400).json({ error: 'patient_id, medication, dosage, frequency and duration are required.' });
      }

      const patient = await UserModel.findById(patient_id);
      if (!patient || patient.role !== 'patient') {
        return res.status(404).json({ error: 'Patient not found.' });
      }

      const prescription = await PrescriptionModel.create({
        patient_id,
        doctor_id: req.user.id,
        medication,
        dosage,
        frequency,
        duration,
        notes
      });

      res.status(201).json({ message: 'Prescription created successfully.', prescription });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  
  async getAll(req, res) {
    try {
      const { role, id } = req.user;
      const prescriptions = role === 'doctor'
        ? await PrescriptionModel.findByDoctor(id)
        : await PrescriptionModel.findByPatient(id);

      res.json({ prescriptions });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  
  async getOne(req, res) {
    try {
      const prescription = await PrescriptionModel.findById(req.params.id);

      if (!prescription) {
        return res.status(404).json({ error: 'Prescription not found.' });
      }

      const { role, id } = req.user;
      if (role === 'doctor' && prescription.doctor_id !== id) {
        return res.status(403).json({ error: 'Access denied. Not your prescription.' });
      }
      if (role === 'patient' && prescription.patient_id !== id) {
        return res.status(403).json({ error: 'Access denied. Not your prescription.' });
      }

      res.json({ prescription });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  
  async update(req, res) {
    try {
      const { medication, dosage, frequency, duration, notes } = req.body;

      if (!medication || !dosage || !frequency || !duration) {
        return res.status(400).json({ error: 'medication, dosage, frequency and duration are required.' });
      }

      const updated = await PrescriptionModel.update(req.params.id, req.user.id, { medication, dosage, frequency, duration, notes });

      if (!updated) {
        return res.status(404).json({ error: 'Prescription not found or not authorized.' });
      }

      res.json({ message: 'Prescription updated successfully.', prescription: updated });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  
  async delete(req, res) {
    try {
      const deleted = await PrescriptionModel.delete(req.params.id, req.user.id);

      if (!deleted) {
        return res.status(404).json({ error: 'Prescription not found or not authorized.' });
      }

      res.json({ message: 'Prescription deleted successfully.' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  
  async getPatients(req, res) {
    try {
      const patients = await UserModel.getAllPatients();
      res.json({ patients });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = PrescriptionController;
