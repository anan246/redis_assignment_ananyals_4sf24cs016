const express = require('express');
const router = express.Router();
const PrescriptionController = require('../controllers/prescriptionController');
const { authenticate, authorizeRole } = require('../middleware/authMiddleware');

// All prescription routes require authentication
router.use(authenticate);

// Doctor-only: list all patients (for selecting when creating prescription)
router.get('/patients', authorizeRole('doctor'), PrescriptionController.getPatients);

// Doctor: create | Both: view list
router.post('/', authorizeRole('doctor'), PrescriptionController.create);
router.get('/', PrescriptionController.getAll);

// Both: view single | Doctor: update & delete
router.get('/:id', PrescriptionController.getOne);
router.put('/:id', authorizeRole('doctor'), PrescriptionController.update);
router.delete('/:id', authorizeRole('doctor'), PrescriptionController.delete);

module.exports = router;
