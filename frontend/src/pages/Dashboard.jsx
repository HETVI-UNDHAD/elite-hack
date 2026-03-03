import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { registrationService } from '../services/registrationService';
import { teamService } from '../services/teamService';
import { Link, useSearchParams } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteMessage, setInviteMessage] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [joinRequests, setJoinRequests] = useState([]);

  useEffect(() => {
    loadRegistrations();
    checkPendingInvite();
    loadJoinRequests();
  }, []);

  const checkPendingInvite = async () => {
    const inviteToken = searchParams.get('invite');
    if (inviteToken) {
      try {
        const data = await teamService.acceptInvitation(inviteToken);
        setInviteMessage(`✅ Successfully joined team "${data.team.name}" for event "${data.event.name}"!`);
        // Remove invite param from URL
        searchParams.delete('invite');
        setSearchParams(searchParams);
        // Reload registrations to show new team
        setTimeout(() => loadRegistrations(), 1000);
      } catch (error) {
        setInviteMessage(`❌ ${error.response?.data?.error || 'Failed to accept invitation'}`);
      }
    }
  };

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

  const loadJoinRequests = async () => {
    try {
      const data = await registrationService.getMyRegistrations();
      const allRequests = [];
      
      for (const reg of data) {
        const userId = user?.id || user?.userId;
        if (reg.teams && reg.teams.leader_id === userId) {
          const requests = await teamService.getTeamJoinRequests(reg.team_id);
          allRequests.push(...requests.map(r => ({ ...r, eventName: reg.events.name, teamName: reg.teams.name })));
        }
      }
      
      setJoinRequests(allRequests);
    } catch (error) {
      console.error('Failed to load join requests:', error);
    }
  };

  const handleJoinRequest = async (requestId, action) => {
    try {
      await teamService.handleJoinRequest(requestId, action);
      setInviteMessage(action === 'approve' ? '✅ Invitation sent to user!' : '❌ Request rejected');
      loadJoinRequests();
    } catch (error) {
      setInviteMessage('❌ Failed to handle request');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}!</h1>

      {inviteMessage && (
        <div className={`mb-6 p-4 rounded-lg border-2 ${
          inviteMessage.includes('✅') 
            ? 'bg-green-50 border-green-300 text-green-800' 
            : 'bg-red-50 border-red-300 text-red-800'
        }`}>
          <p className="font-semibold text-lg">{inviteMessage}</p>
        </div>
      )}

      {joinRequests.length > 0 && (
        <div className="card mb-6 bg-yellow-50 border-2 border-yellow-300">
          <h2 className="text-xl font-bold mb-4 text-yellow-800">📨 Join Requests ({joinRequests.length})</h2>
          <div className="space-y-3">
            {joinRequests.map((req) => (
              <div key={req.id} className="bg-white p-4 rounded-lg border border-yellow-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-lg">{req.users.name}</p>
                    <p className="text-sm text-gray-600">{req.users.email}</p>
                    <p className="text-sm text-blue-600 mt-1">Team: {req.teamName} | Event: {req.eventName}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleJoinRequest(req.id, 'approve')}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      ✓ Approve & Send Invite
                    </button>
                    <button
                      onClick={() => handleJoinRequest(req.id, 'reject')}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-r from-primary-500 to-blue-500 text-white">
          <h3 className="text-lg font-semibold mb-2">Total Registrations</h3>
          <p className="text-4xl font-bold">{registrations.length}</p>
        </div>
        <div className="card bg-gradient-to-r from-green-500 to-teal-500 text-white">
          <h3 className="text-lg font-semibold mb-2">Approved</h3>
          <p className="text-4xl font-bold">
            {registrations.filter(r => r.status === 'approved').length}
          </p>
        </div>
        <div className="card bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <h3 className="text-lg font-semibold mb-2">Pending</h3>
          <p className="text-4xl font-bold">
            {registrations.filter(r => r.status === 'pending').length}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Registrations</h2>
          <Link to="/events" className="btn-primary">Browse Events</Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : registrations.length === 0 ? (
          <p className="text-gray-600">No registrations yet. Start by browsing events!</p>
        ) : (
          <div className="space-y-4">
            {registrations.map((reg) => (
              <div key={reg.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{reg.events.name}</h3>
                    <p className="text-gray-600 mt-1">{reg.events.description}</p>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Date: {new Date(reg.events.date).toLocaleDateString()}</p>
                      {reg.events.location && <p>Location: {reg.events.location}</p>}
                      {reg.teams && (
                        <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-300 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-bold text-blue-900 text-lg">🏆 Team: {reg.teams.name}</p>
                              <p className="text-blue-700 text-sm mt-1">
                                Invite Code: <span className="font-mono font-bold bg-blue-200 px-2 py-1 rounded">{reg.teams.invite_code}</span>
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(reg.teams.invite_code);
                                alert('Invite code copied!');
                              }}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
                            >
                              📋 Copy Code
                            </button>
                          </div>
                          {reg.teams.members && reg.teams.members.length > 0 && (
                            <div className="mt-3 pt-3 border-t-2 border-blue-200">
                              <p className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                <span className="text-lg">👥</span>
                                Team Members ({reg.teams.members.length})
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {reg.teams.members.map((member, idx) => {
                                  const isLeader = member.user_id === reg.teams.leader_id;
                                  return (
                                    <div key={idx} className={`bg-white border-2 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow ${
                                      isLeader ? 'border-yellow-400 bg-yellow-50' : 'border-blue-200'
                                    }`}>
                                      <div className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${
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
                                          <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                            ✓ Accepted
                                          </span>
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
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(reg.status)}`}>
                      {reg.status.toUpperCase()}
                    </span>
                    {reg.attended && (
                      <p className="text-green-600 text-sm mt-2">✓ Attended</p>
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

export default Dashboard;
