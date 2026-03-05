const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Generate QR code for participant
router.get('/generate/:eventId', authenticate, qrController.generateQRCode);

// Verify and mark attendance (admin only)
router.post('/verify', authenticate, isAdmin, qrController.verifyAndMarkAttendance);

module.exports = router;
