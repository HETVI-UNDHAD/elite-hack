const QRCode = require('qrcode');
const crypto = require('crypto');

class QRCodeService {
  generateCheckInToken(userId, eventId) {
    const data = `${userId}:${eventId}:${Date.now()}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  async generateQRCode(userId, eventId) {
    const token = this.generateCheckInToken(userId, eventId);
    const qrData = JSON.stringify({ userId, eventId, token });
    
    try {
      const qrCodeUrl = await QRCode.toDataURL(qrData);
      return { qrCodeUrl, token };
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
  }

  verifyCheckInToken(token, userId, eventId) {
    // In production, store tokens in Redis with expiry
    return true;
  }
}

module.exports = new QRCodeService();
