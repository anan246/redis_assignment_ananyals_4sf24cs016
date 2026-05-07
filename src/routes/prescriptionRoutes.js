const express = require('express');
const router = express.Router();
const PrescriptionController = require('../controllers/prescriptionController');
const { authenticate, authorizeRole } = require('../middleware/authMiddleware');


router.use(authenticate);


router.get('/patients', authorizeRole('doctor'), PrescriptionController.getPatients);


router.post('/', authorizeRole('doctor'), PrescriptionController.create);
router.get('/', PrescriptionController.getAll);


router.get('/:id', PrescriptionController.getOne);
router.put('/:id', authorizeRole('doctor'), PrescriptionController.update);
router.delete('/:id', authorizeRole('doctor'), PrescriptionController.delete);

module.exports = router;
