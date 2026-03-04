import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';
import { eventService } from '../services/eventService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [eventRegistrations, setEventRegistrations] = useState({});
  const [expandedTeam, setExpandedTeam] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, eventsData] = await Promise.all([
        analyticsService.getDashboardStats(),
        eventService.getAllEvents()
      ]);
      setStats(statsData);
      setEvents(eventsData);
      
      // Load registrations for all events
      const token = localStorage.getItem('token');
      const registrationsMap = {};
      for (const event of eventsData) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/registrations/event/${event.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        registrationsMap[event.id] = data;
      }
      setEventRegistrations(registrationsMap);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadRegistrations = async (eventId, eventName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/registrations/event/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const registrations = await response.json();
      
      // Group by teams
      const teams = {};
      const individuals = [];
      
      registrations.forEach(reg => {
        if (reg.teams) {
          if (!teams[reg.team_id]) {
            teams[reg.team_id] = {
              name: reg.teams.name,
              leader_id: reg.teams.leader_id,
              members: []
            };
          }
          teams[reg.team_id].members.push(reg);
        } else {
          individuals.push(reg);
        }
      });
      
      // Create CSV with teams
      const headers = ['Team Name', 'Team Leader', 'Member 1', 'Member 2', 'Member 3', 'Member 4', 'Member 5', 'Status'];
      const rows = [];
      
      // Add team rows
      Object.values(teams).forEach(team => {
        const leader = team.members.find(m => m.user_id === team.leader_id);
        const otherMembers = team.members.filter(m => m.user_id !== team.leader_id);
        
        const row = [
          team.name,
          leader ? `${leader.users.name} (${leader.users.email})` : '',
          ...otherMembers.slice(0, 5).map(m => `${m.users.name} (${m.users.email})`),
          ...Array(5 - otherMembers.length).fill(''),
          team.members[0].status
        ];
        rows.push(row);
      });
      
      // Add individual rows
      individuals.forEach(reg => {
        rows.push([
          'Individual',
          `${reg.users.name} (${reg.users.email})`,
          '', '', '', '', '',
          reg.status
        ]);
      });
      
      const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      // Download
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${eventName.replace(/\s+/g, '_')}_registrations.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download registrations');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.deleteEvent(id);
        loadData();
      } catch (error) {
        alert('Failed to delete event');
      }
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Admin Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-bold mb-3">🔑 Admin Dashboard</h1>
              <p className="text-xl text-purple-100">Manage events, registrations, and analytics</p>
            </div>
            <Link 
              to="/admin/create-event" 
              className="bg-white text-purple-600 px-8 py-4 rounded-xl hover:bg-purple-50 font-bold shadow-xl transition-all transform hover:scale-105 text-lg"
            >
              + Create New Event
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Events</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalEvents || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">📅</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">👥</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Registrations</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalRegistrations || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">📝</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Approved</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.approvedRegistrations || 0}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl">✓</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Manage Events</h2>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-600 text-lg mb-6">No events created yet</p>
            <Link to="/admin/create-event" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold shadow-md">
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const registrations = eventRegistrations[event.id] || [];
              const isExpanded = expandedEvent === event.id;
              
              return (
                <div key={event.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl hover:shadow-lg transition-all overflow-hidden">
                  <div className="p-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{event.name}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <span>📍</span>
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 font-semibold text-blue-600">
                        <span>👥</span>
                        <span>{registrations.length} Registered</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Registrations List */}
                  {isExpanded && registrations.length > 0 && (
                    <div className="p-4 bg-gray-50 border-b max-h-60 overflow-y-auto">
                      <h4 className="font-bold text-sm text-gray-700 mb-2">📋 Registered Teams & Members:</h4>
                      <div className="space-y-2">
                        {/* Group by teams */}
                        {(() => {
                          const teams = {};
                          const individuals = [];
                          
                          registrations.forEach(reg => {
                            if (reg.teams) {
                              if (!teams[reg.team_id]) {
                                teams[reg.team_id] = {
                                  name: reg.teams.name,
                                  members: []
                                };
                              }
                              teams[reg.team_id].members.push(reg);
                            } else {
                              individuals.push(reg);
                            }
                          });
                          
                          return (
                            <>
                              {/* Teams */}
                              {Object.entries(teams).map(([teamId, team]) => {
                                const isTeamExpanded = expandedTeam === teamId;
                                return (
                                  <div key={teamId} className="bg-white rounded-lg border border-blue-200">
                                    <button
                                      onClick={() => setExpandedTeam(isTeamExpanded ? null : teamId)}
                                      className="w-full p-3 text-left hover:bg-blue-50 transition-colors rounded-lg"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <span className="text-lg">🏆</span>
                                          <span className="font-bold text-gray-900">{team.name}</span>
                                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                                            {team.members.length} members
                                          </span>
                                        </div>
                                        <span className="text-gray-400">{isTeamExpanded ? '▲' : '▼'}</span>
                                      </div>
                                    </button>
                                    
                                    {isTeamExpanded && (
                                      <div className="px-3 pb-3 space-y-2">
                                        {team.members.map((reg) => (
                                          <div key={reg.id} className="bg-blue-50 rounded p-2 border border-blue-200">
                                            <div className="flex items-start justify-between">
                                              <div>
                                                <p className="font-semibold text-gray-900 text-sm">{reg.users.name}</p>
                                                <p className="text-xs text-gray-600">{reg.users.email}</p>
                                              </div>
                                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                                reg.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                              }`}>
                                                {reg.status}
                                              </span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                              
                              {/* Individual registrations */}
                              {individuals.map((reg) => (
                                <div key={reg.id} className="bg-white rounded-lg p-3 border border-gray-200 text-sm">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <p className="font-bold text-gray-900">{reg.users.name}</p>
                                      <p className="text-xs text-gray-600">{reg.users.email}</p>
                                      <p className="text-xs text-gray-500 mt-1">👤 Individual</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                      reg.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                      {reg.status}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="space-y-2">
                      <button
                        onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                        className="block w-full text-center bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 font-semibold text-sm transition-colors"
                      >
                        {isExpanded ? '▲ Hide' : '▼ Show'} Registrations ({(() => {
                          const teams = new Set();
                          registrations.forEach(reg => {
                            if (reg.teams) {
                              teams.add(reg.team_id);
                            }
                          });
                          return `${teams.size} ${teams.size === 1 ? 'team' : 'teams'}`;
                        })()})
                      </button>
                      <Link 
                        to={`/admin/event/${event.id}`} 
                        className="block text-center bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-semibold text-sm transition-colors"
                      >
                        Manage Event
                      </Link>
                      <div className="grid grid-cols-2 gap-2">
                        <Link 
                          to={`/admin/event/${event.id}/add-details`} 
                          className="text-center bg-indigo-50 text-indigo-700 py-2 rounded-lg hover:bg-indigo-100 font-semibold text-sm transition-colors"
                        >
                          Add Details
                        </Link>
                        <Link 
                          to={`/admin/edit-event/${event.id}`} 
                          className="text-center bg-green-50 text-green-700 py-2 rounded-lg hover:bg-green-100 font-semibold text-sm transition-colors"
                        >
                          Edit
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => handleDownloadRegistrations(event.id, event.name)} 
                          className="text-center bg-purple-50 text-purple-700 py-2 rounded-lg hover:bg-purple-100 font-semibold text-sm transition-colors"
                        >
                          📥 Download
                        </button>
                        <button 
                          onClick={() => handleDeleteEvent(event.id)} 
                          className="text-center bg-red-50 text-red-700 py-2 rounded-lg hover:bg-red-100 font-semibold text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
