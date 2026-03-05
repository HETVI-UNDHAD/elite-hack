const qrCodeService = require('../services/qrCodeService');
const Registration = require('../models/Registration');

exports.generateQRCode = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.userId;
    
    // Check if user is registered for this event
    const registration = await Registration.findByUserAndEvent(userId, eventId);
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    const { qrCodeUrl, token } = await qrCodeService.generateQRCode(userId, eventId);
    res.json({ qrCodeUrl, token, registration });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyAndMarkAttendance = async (req, res) => {
  try {
    const { token, userId, eventId } = req.body;
    
    if (!token || !userId || !eventId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify QR code token
    const isValid = qrCodeService.verifyCheckInToken(token, userId, eventId);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired QR code' });
    }

    // Mark attendance
    const registration = await Registration.markAttendance(userId, eventId, true);
    res.json({ message: 'Attendance marked successfully', registration });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
