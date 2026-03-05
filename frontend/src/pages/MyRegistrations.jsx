import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { registrationService } from '../services/registrationService';
import { Link } from 'react-router-dom';

const MyRegistrations = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      const data = await registrationService.getMyRegistrations();
      setRegistrations(data);
    } catch (error) {
      console.error('Failed to load registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white py-12 px-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold mb-3">📝 My Registrations</h1>
          <p className="text-xl text-blue-100">View all your event registrations and team details</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading your registrations...</p>
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <div className="text-8xl mb-6">📋</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No registrations yet</h3>
            <p className="text-gray-600 mb-6">Start by browsing and registering for events!</p>
            <Link to="/dashboard" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 font-bold shadow-lg">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {registrations.map((reg) => (
              <div key={reg.id} className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-3xl font-bold mb-2">{reg.events.name}</h3>
                      <p className="text-blue-100">{reg.events.description}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(reg.status)}`}>
                      {reg.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <span className="text-xl">📅</span> Event Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-semibold">Date:</span> {new Date(reg.events.date).toLocaleDateString()}</p>
                        <p><span className="font-semibold">Location:</span> {reg.events.location || 'Online'}</p>
                        <p><span className="font-semibold">Registration Deadline:</span> {new Date(reg.events.registration_deadline).toLocaleDateString()}</p>
                        <p><span className="font-semibold">Team Size:</span> {reg.events.min_team_size} - {reg.events.max_team_size} members</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <span className="text-xl">ℹ️</span> Registration Info
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-semibold">Registered On:</span> {new Date(reg.created_at).toLocaleDateString()}</p>
                        <p><span className="font-semibold">Status:</span> <span className={`px-2 py-1 rounded ${getStatusColor(reg.status)}`}>{reg.status}</span></p>
                        {reg.attended && <p className="text-green-600 font-bold">✓ Attended</p>}
                      </div>
                    </div>
                  </div>

                  {reg.teams && (
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                      <h4 className="font-bold text-gray-800 text-xl mb-4 flex items-center gap-2">
                        <span className="text-2xl">🏆</span> Team: {reg.teams.name}
                      </h4>

                      {reg.teams.members && reg.teams.members.length > 0 && (
                        <div>
                          <h5 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <span className="text-xl">👥</span> Team Members ({reg.teams.members.length})
                          </h5>
                          <div className="grid md:grid-cols-2 gap-3">
                            {reg.teams.members.map((member, idx) => {
                              const isLeader = member.user_id === reg.teams.leader_id;
                              return (
                                <div
                                  key={idx}
                                  className={`bg-white rounded-lg p-4 border-2 shadow-sm ${
                                    isLeader ? 'border-yellow-400 bg-yellow-50' : 'border-blue-200'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md ${
                                      isLeader ? 'bg-gradient-to-br from-yellow-500 to-orange-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                    }`}>
                                      {member.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="font-bold text-gray-900">{member.name}</p>
                                        {isLeader && (
                                          <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs font-bold rounded-full">👑 Leader</span>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-600">{member.email}</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-6 flex gap-3">
                    <Link
                      to={`/events/${reg.events.id}`}
                      className="flex-1 text-center bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-bold shadow-lg transition-all"
                    >
                      View Event Details
                    </Link>
                    {reg.status === 'approved' && (
                      <Link
                        to={`/qr/${reg.events.id}`}
                        className="flex-1 text-center bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 font-bold shadow-lg transition-all"
                      >
                        📱 Show QR Code
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRegistrations;
