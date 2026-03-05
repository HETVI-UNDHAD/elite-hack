import { useState } from 'react';
import axios from 'axios';

const QRScanner = () => {
  const [scanData, setScanData] = useState({ token: '', userId: '', eventId: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data } = await axios.post('/api/qr/verify', scanData);
      setMessage(`✅ ${data.message}`);
      setScanData({ token: '', userId: '', eventId: '' });
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.error || 'Verification failed'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="container mx-auto max-w-2xl pt-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-emerald-100">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📷</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">QR Scanner</h2>
            <p className="text-gray-600">Scan participant QR codes to mark attendance</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl border-2 ${
              message.includes('✅') 
                ? 'bg-green-50 border-green-300 text-green-800' 
                : 'bg-red-50 border-red-300 text-red-800'
            }`}>
              <p className="font-semibold text-center">{message}</p>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                QR Token
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                placeholder="Enter or scan QR token"
                value={scanData.token}
                onChange={(e) => setScanData({ ...scanData, token: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                User ID
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                placeholder="User ID from QR"
                value={scanData.userId}
                onChange={(e) => setScanData({ ...scanData, userId: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Event ID
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                placeholder="Event ID from QR"
                value={scanData.eventId}
                onChange={(e) => setScanData({ ...scanData, eventId: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Mark Attendance ✨'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">💡 Tip:</span> In production, integrate a QR scanner library to automatically read QR codes from camera.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
