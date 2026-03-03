import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';
import { eventService } from '../services/eventService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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
      
      // Convert to CSV
      const headers = ['Name', 'Email', 'Team', 'Status', 'Registration Date'];
      const rows = registrations.map(reg => [
        reg.users.name,
        reg.users.email,
        reg.teams?.name || 'Individual',
        reg.status,
        new Date(reg.created_at).toLocaleDateString()
      ]);
      
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage events, registrations, and users</p>
        </div>

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
          <h2 className="text-2xl font-bold text-gray-900">Events</h2>
          <Link to="/admin/create-event" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 font-semibold shadow-sm transition-all">
            + Create Event
          </Link>
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
            {events.map((event) => (
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
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
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
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
