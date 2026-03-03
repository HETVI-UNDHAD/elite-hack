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

  useEffect(() => {
    loadEvent();
    loadUserRegistration();
  }, [id]);

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

  const handlePostRequest = async () => {
    try {
      await teamService.postTeamRequest({
        team_id: userRegistration.team_id,
        members_needed: membersNeeded,
        message: requestMessage
      });
      setMessage('Request posted successfully!');
      setShowRequestModal(false);
      setMembersNeeded(1);
      setRequestMessage('');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to post request');
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
      // Reload registration to show team info
      await loadUserRegistration();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to create team');
    }
  };

  const handleInviteMember = async () => {
    if (!memberEmail) {
      setMessage('Please enter member email');
      return;
    }
    try {
      await teamService.inviteTeamMember(createdTeamId, memberEmail);
      setMessage(`Invitation sent to ${memberEmail}! They will receive an email to join the team.`);
      setMemberEmail('');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to send invitation');
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

  console.log('Debug - User Registration:', userRegistration);
  console.log('Debug - Is Team Leader:', isTeamLeader);
  console.log('Debug - User ID:', userId);
  console.log('Debug - Team Leader ID:', userRegistration?.teams?.leader_id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="card">
            <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
            <p className="text-gray-600 mb-6">{event.description}</p>

            {event.rounds && event.rounds.length > 0 && (
              <div className="mb-6">
                <EventRoundsFlow rounds={event.rounds} eventDate={event.date} />
              </div>
            )}

            {userRegistration && userRegistration.team_id && (
              <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
                <p className="font-semibold text-blue-800">Your Team: {userRegistration.teams?.name || 'Loading...'}</p>
                {isTeamLeader && (
                  <button
                    onClick={() => setShowRequestModal(true)}
                    className="mt-2 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    📢 Post Team Request
                  </button>
                )}
              </div>
            )}

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="font-semibold">Date:</p>
            <p>{new Date(event.date).toLocaleDateString()}</p>
          </div>
          {event.location && (
            <div>
              <p className="font-semibold">Location:</p>
              <p>{event.location}</p>
            </div>
          )}
          <div>
            <p className="font-semibold">Registration Deadline:</p>
            <p>{new Date(event.registration_deadline).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-semibold">Team Size:</p>
            <p>{event.min_team_size} - {event.max_team_size} members</p>
          </div>
        </div>

        {event.stats && (
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">Event Statistics</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary-600">{event.stats.totalRegistrations}</p>
                <p className="text-sm text-gray-600">Total Registrations</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{event.stats.approvedRegistrations}</p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{event.stats.attendedCount}</p>
                <p className="text-sm text-gray-600">Attended</p>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className={`mb-4 p-4 rounded border-2 ${
            message.includes('successfully') || message.includes('created') || message.includes('invite code') 
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
            <div className="bg-green-50 border border-green-300 rounded-lg p-4 text-center">
              <p className="text-green-800 font-semibold">✓ You are registered for this event</p>
              <button 
                onClick={() => navigate('/dashboard')}
                className="mt-2 btn-primary"
              >
                Go to Dashboard
              </button>
            </div>
          ) : !isTeamEvent ? (
            <button onClick={handleRegisterIndividual} disabled={registering} className="btn-primary w-full">
              {registering ? 'Registering...' : 'Register for Event'}
            </button>
          ) : (
            <>
              <button onClick={() => setShowTeamModal('create')} className="btn-primary w-full">
                Create Team
              </button>
              <button onClick={() => setShowTeamModal('join')} className="btn-secondary w-full">
                Join Existing Team
              </button>
            </>
          )}
        </div>

        {showTeamModal === 'create' && (
          <div className="mt-4 p-4 border rounded-lg">
            <h3 className="font-semibold mb-3">Create New Team</h3>
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

        {showTeamModal === 'join' && (
          <div className="mt-4 p-4 border rounded-lg">
            <h3 className="font-semibold mb-3">Join Team</h3>
            <input
              type="text"
              placeholder="Enter Invite Code"
              className="input-field mb-3"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
            />
            <button onClick={handleJoinTeam} className="btn-primary w-full">Join Team</button>
          </div>
        )}

        {showRequestModal && (
          <div className="mt-4 p-4 border rounded-lg bg-blue-50">
            <h3 className="font-semibold mb-3">📢 Post Team Member Request</h3>
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
        )}
      </div>
    </div>

    <div className="w-80">
      <TeamRequestPanel 
        eventId={id} 
        userTeamId={userRegistration?.team_id}
        isTeamLeader={isTeamLeader}
        maxTeamSize={event?.max_team_size}
      />
    </div>
  </div>
    </div>
  );
};

export default EventDetail;
