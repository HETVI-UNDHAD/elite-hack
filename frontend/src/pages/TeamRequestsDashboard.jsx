import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const TeamRequestsDashboard = () => {
  const { user } = useAuth();
  const [teamRequests, setTeamRequests] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [requestsRes, joinsRes] = await Promise.all([
        axios.get('/api/team-requests'),
        axios.get('/api/join-requests/my-requests')
      ]);
      setTeamRequests(requestsRes.data);
      setJoinRequests(joinsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async (requestId) => {
    try {
      await axios.post(`/api/join-requests/${requestId}/apply`);
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to send join request');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-12 px-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold mb-4">Team Requests Hub 🤝</h1>
          <p className="text-xl text-emerald-100">Find teammates or join existing teams</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              activeTab === 'browse'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
            }`}
          >
            🔍 Browse Requests ({teamRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('my-requests')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              activeTab === 'my-requests'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
            }`}
          >
            📋 My Requests ({joinRequests.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent"></div>
          </div>
        ) : activeTab === 'browse' ? (
          <div className="space-y-5">
            {teamRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all p-6 border-2 border-emerald-100">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{request.team_name}</h3>
                    <p className="text-gray-600 mb-4">{request.message}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>👥 Need {request.members_needed} members</span>
                      <span>📅 {new Date(request.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoinRequest(request.id)}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
                  >
                    Join Team ✨
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {joinRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-2xl shadow-md p-6 border-2 border-emerald-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{request.team_name}</h3>
                    <p className="text-gray-600">Status: <span className={`font-semibold ${
                      request.status === 'approved' ? 'text-green-600' :
                      request.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                    }`}>{request.status}</span></p>
                  </div>
                  <span className="text-sm text-gray-500">📅 {new Date(request.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamRequestsDashboard;
