import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../services/eventService';
import { teamService } from '../services/teamService';
import { Link, useSearchParams } from 'react-router-dom';
import CommonChat from '../components/CommonChat';

const Dashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const [inviteMessage, setInviteMessage] = useState('');

  useEffect(() => {
    loadEvents();
    checkPendingInvite();
  }, []);

  const checkPendingInvite = async () => {
    const inviteToken = searchParams.get('invite');
    if (inviteToken) {
      try {
        const data = await teamService.acceptInvitation(inviteToken);
        setInviteMessage(`✅ Successfully joined team "${data.team.name}" for event "${data.event.name}"!`);
        searchParams.delete('invite');
        setSearchParams(searchParams);
        setTimeout(() => window.location.reload(), 2000);
      } catch (error) {
        const errorMsg = error.response?.data?.error || 'Failed to accept invitation';
        if (errorMsg.includes('already processed')) {
          setInviteMessage('❌ This invitation has already been used. Please check your registrations.');
        } else if (errorMsg.includes('expired')) {
          setInviteMessage('❌ This invitation has expired. Please request a new invitation from the team leader.');
        } else if (errorMsg.includes('Already registered')) {
          setInviteMessage('✅ You are already registered for this event!');
        } else {
          setInviteMessage(`❌ ${errorMsg}`);
        }
      }
    }
  };

  const loadEvents = async () => {
    try {
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysLeft = (deadline) => {
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredEvents = events.filter(event => {
    const daysLeft = getDaysLeft(event.registration_deadline);
    if (filter === 'all') return true;
    if (filter === 'free') return !event.fee || event.fee === 0;
    if (filter === 'paid') return event.fee > 0;
    if (filter === 'closing') return daysLeft > 0 && daysLeft <= 7;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white py-8 px-4 shadow-lg">
        <div className="container mx-auto">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
            <p className="text-sm text-blue-100">Discover amazing hackathons, competitions, and events</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
        {inviteMessage && (
          <div className={`mb-6 p-4 rounded-lg border-2 ${
            inviteMessage.includes('✅') 
              ? 'bg-green-50 border-green-300 text-green-800' 
              : 'bg-red-50 border-red-300 text-red-800'
          }`}>
            <p className="font-semibold text-lg">{inviteMessage}</p>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${
              filter === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
            }`}
          >
            🎯 All Events ({events.length})
          </button>
          <button
            onClick={() => setFilter('free')}
            className={`px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${
              filter === 'free'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            🎁 Free Events ({events.filter(e => !e.fee || e.fee === 0).length})
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${
              filter === 'paid'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            💎 Paid Events ({events.filter(e => e.fee > 0).length})
          </button>
          <button
            onClick={() => setFilter('closing')}
            className={`px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${
              filter === 'closing'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            ⏰ Closing Soon ({events.filter(e => getDaysLeft(e.registration_deadline) > 0 && getDaysLeft(e.registration_deadline) <= 7).length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading amazing events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No events found</h3>
            <p className="text-gray-600">Try changing your filter or check back later!</p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredEvents.map((event) => {
              const daysLeft = getDaysLeft(event.registration_deadline);
              const isFeatured = event.stats?.totalRegistrations > 100;
              const isFree = !event.fee || event.fee === 0;
              
              return (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-blue-100 overflow-hidden group hover:scale-[1.01]"
                >
                  {/* Event Image */}
                  <div className="h-48 overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500">
                    {event.image_url ? (
                      <img 
                        src={event.image_url} 
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white"><div class="text-center"><div class="text-6xl mb-2">🎯</div><p class="text-xl font-bold">${event.name}</p></div></div>`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <div className="text-center">
                          <div className="text-6xl mb-2">🎯</div>
                          <p className="text-xl font-bold">{event.name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex gap-6">
                      {/* Left Section - Fee & Members */}
                      <div className="flex flex-col items-center justify-start min-w-[120px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                        <div className="text-center mb-4">
                          {isFree ? (
                            <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">FREE</div>
                          ) : (
                            <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">₹{event.fee}</div>
                          )}
                          <div className="text-xs text-gray-500 mt-1 font-medium">Entry Fee</div>
                        </div>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-4"></div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-800">
                            {event.min_team_size === event.max_team_size 
                              ? event.min_team_size 
                              : `${event.min_team_size}-${event.max_team_size}`}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 font-medium">Team Size</div>
                        </div>
                      </div>

                      {/* Middle Section - Event Details */}
                      <div className="flex-1">
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {isFeatured && (
                            <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1">
                              ⭐ Featured
                            </span>
                          )}
                          {daysLeft <= 3 && daysLeft > 0 && (
                            <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-md animate-pulse">
                              🔥 Ending Soon
                            </span>
                          )}
                          {isFree && (
                            <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-md">
                              🎁 Free Entry
                            </span>
                          )}
                        </div>

                        <Link to={`/events/${event.id}`} className="block group">
                          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-1">
                            {event.name}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-gray-600 text-sm">📍 {event.location || 'Online'}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-600 text-sm">🏢 {event.organizer || 'Presidency University'}</span>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                        <div className="flex flex-wrap gap-2">
                          {event.category && (
                            <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200">
                              {event.category}
                            </span>
                          )}
                          {event.subcategory && (
                            <span className="px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg border border-purple-200">
                              {event.subcategory}
                            </span>
                          )}
                          {event.eligibility && (
                            <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-lg border border-green-200">
                              {event.eligibility}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Section - Days Left & CTA */}
                      <div className="flex flex-col items-end justify-between min-w-[140px]">
                        <div className="text-right">
                          {daysLeft > 0 ? (
                            <>
                              <div className={`text-4xl font-bold ${
                                daysLeft <= 3 ? 'text-red-600' : daysLeft <= 7 ? 'text-orange-600' : 'text-green-600'
                              }`}>{daysLeft}</div>
                              <div className="text-xs text-gray-500 font-medium">days left</div>
                            </>
                          ) : (
                            <div className="text-red-600 font-bold text-sm">Closed</div>
                          )}
                        </div>
                        
                        {event.stats?.totalRegistrations > 0 && (
                          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg px-4 py-2 border border-blue-100">
                            <div className="text-lg font-bold text-gray-800">
                              {event.stats.totalRegistrations.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">Registered</div>
                          </div>
                        )}

                        <Link
                          to={`/events/${event.id}`}
                          className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span>📅 Posted {formatDate(event.created_at)}</span>
                      <span>⏰ Deadline: {formatDate(event.registration_deadline)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
          </div>

          {/* Chat Sidebar */}
          <div className="w-96 sticky top-20" style={{ alignSelf: 'flex-start' }}>
            <CommonChat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
