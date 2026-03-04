import { useState, useEffect } from 'react';
import { teamService } from '../services/teamService';
import { useAuth } from '../contexts/AuthContext';

const TeamRequestPanel = ({ eventId, userTeamId, isTeamLeader, maxTeamSize }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState({});
  const [showReplyBox, setShowReplyBox] = useState({});

  useEffect(() => {
    loadRequests();
    if (isTeamLeader && userTeamId) {
      loadJoinRequests();
    }
  }, [eventId, userTeamId, isTeamLeader]);

  const loadRequests = async () => {
    try {
      const data = await teamService.getEventRequests(eventId);
      setRequests(data);
    } catch (error) {
      console.error('Failed to load requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const loadJoinRequests = async () => {
    try {
      const data = await teamService.getTeamJoinRequests(userTeamId);
      setJoinRequests(data);
    } catch (error) {
      console.error('Failed to load join requests:', error);
      setJoinRequests([]);
    }
  };

  const handleJoinRequest = async (requestId) => {
    try {
      await teamService.sendJoinRequest(requestId);
      alert('Join request sent successfully!');
      await loadRequests();
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to send join request';
      alert(errorMsg);
      // Reload to get updated status in case team became full
      await loadRequests();
    }
  };

  const handleApproveReject = async (requestId, action) => {
    try {
      await teamService.handleJoinRequest(requestId, action);
      alert(action === 'approve' ? 'Invitation sent!' : 'Request rejected');
      await loadJoinRequests();
      await loadRequests();
      // Reload the page to update team members
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to handle request');
    }
  };

  const handleReply = (requestId) => {
    setShowReplyBox({ ...showReplyBox, [requestId]: !showReplyBox[requestId] });
  };

  const submitReply = async (requestId) => {
    if (!replyText[requestId]?.trim()) return;
    
    try {
      await teamService.postReply(requestId, replyText[requestId]);
      setReplyText({ ...replyText, [requestId]: '' });
      setShowReplyBox({ ...showReplyBox, [requestId]: false });
      loadRequests(); // Reload to show new reply
    } catch (error) {
      console.error('Failed to post reply:', error);
    }
  };

  const filteredRequests = requests.filter(req => 
    req.teams.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
      <h3 className="text-xl font-bold mb-4">🔍 Looking for Team Members</h3>
      
      {/* Search Box */}
      <input
        type="text"
        placeholder="🔎 Search by team name..."
        className="mb-4 px-3 py-2 border rounded-lg text-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      {isTeamLeader && userTeamId && joinRequests.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">📬 Join Requests ({joinRequests.length})</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {joinRequests.map((req) => (
              <div key={req.id} className="bg-white p-2 rounded border text-sm">
                <p className="font-semibold">{req.users.name}</p>
                <p className="text-gray-600 text-xs">{req.users.email}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleApproveReject(req.id, 'approve')}
                    className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleApproveReject(req.id, 'reject')}
                    className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : filteredRequests.length === 0 ? (
          <p className="text-gray-500">{searchTerm ? 'No teams found' : 'No team requests yet'}</p>
        ) : (
          filteredRequests.map((req) => {
            const userId = user?.id || user?.userId;
            const isOwnRequest = req.posted_by === userId;
            const isDisabled = req.status === 'closed';
            
            return (
              <div key={req.id} className={`border rounded-lg p-3 ${
                isDisabled ? 'bg-gray-200 opacity-60' : 'bg-gray-50 hover:bg-gray-100'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-blue-600">{req.teams.name}</p>
                    <p className="text-xs text-gray-600">by {req.users.name}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    isDisabled 
                      ? 'bg-gray-400 text-white' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {isDisabled ? '✓ Full' : `Need ${req.members_needed}`}
                  </span>
                </div>
                {req.message && (
                  <p className="text-sm text-gray-700 mb-2">{req.message}</p>
                )}
                
                {/* Display Replies */}
                {req.replies && req.replies.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {req.replies.map((reply) => (
                      <div key={reply.id} className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
                        <span className="font-semibold">{reply.users.name}:</span> {reply.message}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Reply Button */}
                <button
                  onClick={() => handleReply(req.id)}
                  className="text-xs text-blue-600 hover:underline mb-2 mt-2"
                >
                  💬 Reply
                </button>
                
                {/* Reply Box */}
                {showReplyBox[req.id] && (
                  <div className="mt-2 p-2 bg-white rounded border">
                    <textarea
                      className="w-full text-xs p-2 border rounded"
                      rows="2"
                      placeholder="Write a reply..."
                      value={replyText[req.id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [req.id]: e.target.value })}
                    />
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => submitReply(req.id)}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                      >
                        Send
                      </button>
                      <button
                        onClick={() => setShowReplyBox({ ...showReplyBox, [req.id]: false })}
                        className="text-xs bg-gray-400 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                
                {!isOwnRequest && !userTeamId && !isDisabled && (
                  <button
                    onClick={() => handleJoinRequest(req.id)}
                    className="w-full text-sm bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700 mt-2"
                  >
                    🙋 I want to join
                  </button>
                )}
                
                {isDisabled && (
                  <p className="text-xs text-gray-500 italic mt-2">✓ This team is now full</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TeamRequestPanel;
