const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.post('/', authenticate, registrationController.registerForEvent);
router.get('/my-registrations', authenticate, registrationController.getMyRegistrations);
router.get('/event/:eventId', authenticate, isAdmin, registrationController.getEventRegistrations);
router.put('/:id/status', authenticate, isAdmin, registrationController.updateRegistrationStatus);
router.put('/:id/attendance', authenticate, isAdmin, registrationController.markAttendance);

module.exports = router;
