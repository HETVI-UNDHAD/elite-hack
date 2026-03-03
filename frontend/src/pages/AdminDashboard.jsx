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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Total Events</h3>
          <p className="text-4xl font-bold">{stats?.totalEvents || 0}</p>
        </div>
        <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-4xl font-bold">{stats?.totalUsers || 0}</p>
        </div>
        <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Total Registrations</h3>
          <p className="text-4xl font-bold">{stats?.totalRegistrations || 0}</p>
        </div>
        <div className="card bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Approved</h3>
          <p className="text-4xl font-bold">{stats?.approvedRegistrations || 0}</p>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Events</h2>
          <Link to="/admin/create-event" className="btn-primary">Create New Event</Link>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{event.name}</h3>
                <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <Link to={`/admin/event/${event.id}`} className="btn-secondary">Manage</Link>
                <Link to={`/admin/edit-event/${event.id}`} className="btn-secondary">Edit</Link>
                <button onClick={() => handleDeleteEvent(event.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
