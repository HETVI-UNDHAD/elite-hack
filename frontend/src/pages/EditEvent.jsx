import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventService } from '../services/eventService';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    registration_deadline: '',
    min_team_size: 1,
    max_team_size: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      const event = await eventService.getEventById(id);
      setFormData({
        name: event.name,
        description: event.description || '',
        date: event.date.slice(0, 16),
        location: event.location || '',
        registration_deadline: event.registration_deadline.slice(0, 16),
        min_team_size: event.min_team_size,
        max_team_size: event.max_team_size
      });
    } catch (error) {
      setError('Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await eventService.updateEvent(id, formData);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update event');
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Event</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Event Name</label>
            <input
              type="text"
              className="input-field"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              className="input-field"
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Event Date</label>
              <input
                type="datetime-local"
                className="input-field"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Registration Deadline</label>
              <input
                type="datetime-local"
                className="input-field"
                value={formData.registration_deadline}
                onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              className="input-field"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Min Team Size</label>
              <input
                type="number"
                min="1"
                className="input-field"
                value={formData.min_team_size}
                onChange={(e) => setFormData({ ...formData, min_team_size: parseInt(e.target.value) })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Max Team Size</label>
              <input
                type="number"
                min="1"
                className="input-field"
                value={formData.max_team_size}
                onChange={(e) => setFormData({ ...formData, max_team_size: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="btn-primary flex-1">Update Event</button>
            <button type="button" onClick={() => navigate('/admin')} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
