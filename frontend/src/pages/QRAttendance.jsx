import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const QRAttendance = () => {
  const { eventId } = useParams();
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQRCode();
  }, [eventId]);

  const loadQRCode = async () => {
    try {
      const { data } = await axios.get(`/api/qr/generate/${eventId}`);
      setQrCode(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md border-2 border-red-200">
          <div className="text-6xl mb-4 text-center">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Error</h2>
          <p className="text-red-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border-2 border-emerald-100">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎫</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Attendance QR</h2>
          <p className="text-gray-600">Show this to the admin for check-in</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 mb-6">
          <img 
            src={qrCode.qrCodeUrl} 
            alt="Attendance QR Code" 
            className="w-full h-auto rounded-xl shadow-lg"
          />
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-semibold">Status:</span>{' '}
            <span className={`font-bold ${
              qrCode.registration.status === 'approved' ? 'text-green-600' :
              qrCode.registration.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {qrCode.registration.status.toUpperCase()}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Attended:</span>{' '}
            <span className={`font-bold ${qrCode.registration.attended ? 'text-green-600' : 'text-gray-400'}`}>
              {qrCode.registration.attended ? '✓ Yes' : '✗ Not yet'}
            </span>
          </p>
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>⚠️ Do not share this QR code</p>
          <p>Valid for this event only</p>
        </div>
      </div>
    </div>
  );
};

export default QRAttendance;
