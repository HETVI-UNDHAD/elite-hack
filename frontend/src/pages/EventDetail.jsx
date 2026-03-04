import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { teamService } from '../services/teamService';
import { useAuth } from '../contexts/AuthContext';
import TeamRequestPanel from '../components/TeamRequestPanel';
import EventRoundsFlow from '../components/EventRoundsFlow';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [createdTeamId, setCreatedTeamId] = useState(null);
  const [message, setMessage] = useState('');
  const [userRegistration, setUserRegistration] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [membersNeeded, setMembersNeeded] = useState(1);
  const [requestMessage, setRequestMessage] = useState('');
  const [allRegistrations, setAllRegistrations] = useState([]);

  useEffect(() => {
    loadEvent();
    loadUserRegistration();
    if (user?.role === 'admin') {
      loadAllRegistrations();
    }
  }, [id, user]);

  const loadEvent = async () => {
    try {
      const data = await eventService.getEventById(id);
      setEvent(data);
    } catch (error) {
      console.error('Failed to load event:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserRegistration = async () => {
    try {
      const regs = await registrationService.getMyRegistrations();
      const reg = regs.find(r => r.event_id === id);
      setUserRegistration(reg);
    } catch (error) {
      console.error('Failed to load registration:', error);
    }
  };

  const loadAllRegistrations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/registrations/event/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setAllRegistrations(data);
    } catch (error) {
      console.error('Failed to load registrations:', error);
    }
  };

  const handlePostRequest = async () => {
    try {
      await teamService.postTeamRequest({
        team_id: userRegistration.team_id,
        members_needed: membersNeeded,
        message: requestMessage
      });
      setMessage('Request posted successfully!');
      setTimeout(() => setMessage(''), 3000);
      setShowRequestModal(false);
      setMembersNeeded(1);
      setRequestMessage('');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to post request');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRegisterIndividual = async () => {
    setRegistering(true);
    try {
      await registrationService.registerForEvent({ event_id: id });
      setMessage('Registration successful! Awaiting approval.');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const handleCreateTeam = async () => {
    try {
      const teamData = await teamService.createTeam({ name: teamName, event_id: id });
      await registrationService.registerForEvent({ event_id: id, team_id: teamData.team.id });
      setCreatedTeamId(teamData.team.id);
      setMessage(`Team "${teamName}" created successfully! Share this invite code with your team members: ${teamData.team.invite_code}`);
      setTeamName('');
      setTimeout(() => setMessage(''), 3000);
      await loadUserRegistration();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to create team');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleInviteMember = async () => {
    if (!memberEmail) {
      setMessage('Please enter member email');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    try {
      const teamId = createdTeamId || userRegistration?.team_id;
      await teamService.inviteTeamMember(teamId, memberEmail);
      setMessage(`Invitation sent to ${memberEmail}! They will receive an email to join the team.`);
      setMemberEmail('');
      setTimeout(() => setMessage(''), 3000);
      await loadUserRegistration();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to send invitation');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleJoinTeam = async () => {
    try {
      const teamData = await teamService.getTeamByInviteCode(inviteCode);
      await registrationService.registerForEvent({ event_id: id, team_id: teamData.id });
      setMessage('Successfully joined team!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to join team');
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (!event) return <div className="container mx-auto px-4 py-8">Event not found</div>;

  const isTeamEvent = event.max_team_size > 1;
  const userId = user?.id || user?.userId;
  const isTeamLeader = userRegistration?.teams?.leader_id === userId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <div className="border-b pb-4 mb-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">{event.name}</h1>
                <p className="text-gray-600 text-lg">{event.description}</p>
              </div>

              {userRegistration && userRegistration.team_id && (
                <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🏆</span>
                    <p className="font-bold text-blue-900 text-lg">Your Team: {userRegistration.teams?.name || 'Loading...'}</p>
                  </div>
                  {userRegistration.teams?.members && userRegistration.teams.members.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-bold text-blue-800 mb-2">👥 Team Members ({userRegistration.teams.members.length}):</p>
                      <div className="grid grid-cols-1 gap-2">
                        {userRegistration.teams.members.map((member, idx) => {
                          const isLeader = member.user_id === userRegistration.teams.leader_id;
                          return (
                            <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                              isLeader ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300' : 'bg-white border-blue-200'
                            }`}>
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md ${
                                isLeader ? 'bg-gradient-to-br from-yellow-500 to-orange-500' : 'bg-gradient-to-br from-blue-500 to-indigo-500'
                              }`}>
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-gray-900">{member.name}</span>
                                  {isLeader && <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full font-bold">👑 Leader</span>}
                                </div>
                                <span className="text-xs text-gray-600">{member.email}</span>
                              </div>
                              <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-bold">✓ Accepted</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {isTeamLeader && (
                    <button
                      onClick={() => setShowRequestModal(true)}
                      className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-md transition-all"
                    >
                      📢 Post Team Request
                    </button>
                  )}
                </div>
              )}

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-200">
            <p className="font-semibold text-blue-900 mb-1 flex items-center gap-2"><span>📅</span> Date</p>
            <p className="text-gray-800 font-medium">{new Date(event.date).toLocaleDateString()}</p>
          </div>
          {event.location && (
            <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg border border-purple-200">
              <p className="font-semibold text-purple-900 mb-1 flex items-center gap-2"><span>📍</span> Location</p>
              <p className="text-gray-800 font-medium">{event.location}</p>
            </div>
          )}
          <div className="bg-gradient-to-br from-red-50 to-white p-4 rounded-lg border border-red-200">
            <p className="font-semibold text-red-900 mb-1 flex items-center gap-2"><span>⏰</span> Registration Deadline</p>
            <p className="text-gray-800 font-medium">{new Date(event.registration_deadline).toLocaleDateString()}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg border border-green-200">
            <p className="font-semibold text-green-900 mb-1 flex items-center gap-2"><span>👥</span> Team Size</p>
            <p className="text-gray-800 font-medium">{event.min_team_size} - {event.max_team_size} members</p>
          </div>
        </div>

        {event.stats && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-indigo-200 shadow-md">
            <h3 className="font-bold text-lg mb-4 text-indigo-900">📊 Event Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{event.stats.totalRegistrations}</p>
                <p className="text-sm text-gray-600 font-semibold mt-1">Total Registrations</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">{event.stats.approvedRegistrations}</p>
                <p className="text-sm text-gray-600 font-semibold mt-1">Approved</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{event.stats.attendedCount}</p>
                <p className="text-sm text-gray-600 font-semibold mt-1">Attended</p>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className={`mb-4 p-4 rounded border-2 ${
            message.includes('successfully') || message.includes('created') || message.includes('invite code') || message.includes('Invitation sent') 
              ? 'bg-green-50 text-green-800 border-green-300' 
              : 'bg-red-100 text-red-800 border-red-300'
          }`}>
            <p className="font-semibold">{message}</p>
            {message.includes('invite code') && (
              <div className="mt-3">
                <button 
                  onClick={() => {
                    const code = message.match(/[A-Z0-9]{8}/)?.[0];
                    if (code) {
                      navigator.clipboard.writeText(code);
                      alert('Invite code copied to clipboard!');
                    }
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  📋 Copy Invite Code
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="ml-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Go to Dashboard
                </button>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          {userRegistration ? (
            <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-xl p-6 text-center shadow-md">
              <div className="text-5xl mb-3">✓</div>
              <p className="text-green-800 font-bold text-lg">You are registered for this event</p>
              <button 
                onClick={() => navigate('/dashboard')}
                className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-md transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          ) : user?.role === 'admin' ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📋 All Registrations</h3>
              {allRegistrations.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No registrations yet</p>
              ) : (
                <div className="space-y-4">
                  {allRegistrations.map((reg) => (
                    <div key={reg.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-gray-900">{reg.users.name}</p>
                          <p className="text-sm text-gray-600">{reg.users.email}</p>
                          {reg.teams && (
                            <p className="text-sm text-blue-600 mt-1">🏆 Team: {reg.teams.name}</p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          reg.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {reg.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button 
                onClick={() => navigate('/admin')}
                className="mt-4 w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-all"
              >
                Back to Admin Dashboard
              </button>
            </div>
          ) : !isTeamEvent ? (
            <button onClick={handleRegisterIndividual} disabled={registering} className="btn-primary w-full py-4 text-lg shadow-lg">
              {registering ? 'Registering...' : 'Register for Event'}
            </button>
          ) : (
            <button onClick={() => setShowTeamModal('create')} className="btn-primary w-full py-4 text-lg shadow-lg">Create Team</button>
          )}
        </div>

        {showTeamModal === 'create' && (
          <div className="mt-4 p-6 border-2 border-blue-300 rounded-xl bg-gradient-to-br from-blue-50 to-white shadow-lg">
            <h3 className="font-bold text-xl mb-4 text-blue-900">Create New Team</h3>
            {!createdTeamId ? (
              <>
                <input
                  type="text"
                  placeholder="Team Name"
                  className="input-field mb-3"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
                <button onClick={handleCreateTeam} className="btn-primary w-full">Create Team</button>
              </>
            ) : (
              <>
                <div className="bg-green-50 p-3 rounded mb-3">
                  <p className="text-green-800 font-semibold">✓ Team Created!</p>
                </div>
                <h4 className="font-semibold mb-2">Invite Team Members</h4>
                <input
                  type="email"
                  placeholder="Member Email Address"
                  className="input-field mb-3"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                />
                <div className="flex gap-2">
                  <button onClick={handleInviteMember} className="btn-primary flex-1">
                    📧 Send Invitation
                  </button>
                  <button 
                    onClick={() => {
                      setShowTeamModal(false);
                      setCreatedTeamId(null);
                      navigate('/dashboard');
                    }} 
                    className="btn-secondary flex-1"
                  >
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {showRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h3 className="font-bold text-xl mb-4 text-blue-900">📢 Post Team Member Request</h3>
              <div className="mb-3">
                <label className="block text-sm font-semibold mb-1">Members Needed</label>
                <input
                  type="number"
                  min="1"
                  className="input-field"
                  value={membersNeeded}
                  onChange={(e) => setMembersNeeded(parseInt(e.target.value))}
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-semibold mb-1">Message (Optional)</label>
                <textarea
                  className="input-field"
                  rows="3"
                  placeholder="e.g., Looking for developers with React experience..."
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button onClick={handlePostRequest} className="btn-primary flex-1">
                  Post Request
                </button>
                <button onClick={() => setShowRequestModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="w-80">
      <div className="sticky top-4">
        <TeamRequestPanel 
          eventId={id} 
          userTeamId={userRegistration?.team_id}
          isTeamLeader={isTeamLeader}
          maxTeamSize={event?.max_team_size}
        />
      </div>
    </div>
  </div>

  {event.rounds && event.rounds.length > 0 && (
    <div className="mt-6">
      <EventRoundsFlow rounds={event.rounds} eventDate={event.date} />
    </div>
  )}
      </div>
    </div>
  );
};

export default EventDetail;
