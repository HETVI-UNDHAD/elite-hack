import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    registration_deadline: '',
    min_team_size: 1,
    max_team_size: 1
  });
  const [numRounds, setNumRounds] = useState('');
  const [rounds, setRounds] = useState([]);
  const [error, setError] = useState('');
  const [createdEventId, setCreatedEventId] = useState(null);

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await eventService.createEvent(formData);
      setCreatedEventId(response.event.id);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create event');
    }
  };

  const handleNumRoundsSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(numRounds);
    if (num > 0 && num <= 10) {
      const initialRounds = Array.from({ length: num }, (_, i) => ({
        round_name: `Round ${i + 1}`,
        description: '',
        start_date: '',
        end_date: '',
        location: ''
      }));
      setRounds(initialRounds);
      setStep(3);
    }
  };

  const handleRoundChange = (index, field, value) => {
    const updated = [...rounds];
    updated[index][field] = value;
    setRounds(updated);
  };

  const handleRoundsSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/events/${createdEventId}/rounds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rounds })
      });
      if (!response.ok) throw new Error('Failed to add rounds');
      navigate('/admin');
    } catch (err) {
      setError('Failed to add rounds: ' + err.message);
    }
  };

  const skipRounds = () => {
    navigate('/admin');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card max-w-4xl mx-auto">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>1</div>
            <div className={`w-20 h-1 ${
              step >= 2 ? 'bg-blue-600' : 'bg-gray-300'
            }`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>2</div>
            <div className={`w-20 h-1 ${
              step >= 3 ? 'bg-blue-600' : 'bg-gray-300'
            }`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>3</div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-center">
          {step === 1 && 'Create New Event'}
          {step === 2 && 'Add Event Stages'}
          {step === 3 && 'Stage Details'}
        </h1>
        <p className="text-gray-600 text-center mb-6">
          {step === 1 && 'Step 1: Basic event information'}
          {step === 2 && 'Step 2: How many stages/rounds?'}
          {step === 3 && 'Step 3: Configure each stage'}
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Step 1: Event Details */}
        {step === 1 && (
          <form onSubmit={handleEventSubmit} className="space-y-4">
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
            <button type="submit" className="btn-primary flex-1">Next: Add Stages →</button>
            <button type="button" onClick={() => navigate('/admin')} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
        )}

        {/* Step 2: Number of Rounds */}
        {step === 2 && (
          <form onSubmit={handleNumRoundsSubmit} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <label className="block text-lg font-semibold mb-3">How many stages/rounds does this event have?</label>
              <input
                type="number"
                min="1"
                max="10"
                value={numRounds}
                onChange={(e) => setNumRounds(e.target.value)}
                className="input-field text-lg"
                placeholder="Enter number (1-10)"
                required
              />
              <p className="text-sm text-gray-600 mt-2">💡 Example: Preliminary, Semi-Finals, Finals = 3 rounds</p>
            </div>
            <div className="flex gap-4">
              <button type="submit" className="btn-primary flex-1">Next: Configure Stages →</button>
              <button type="button" onClick={skipRounds} className="btn-secondary flex-1">
                Skip & Finish
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Round Details */}
        {step === 3 && (
          <form onSubmit={handleRoundsSubmit} className="space-y-6">
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {rounds.map((round, index) => (
                <div key={index} className="border-2 border-blue-200 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                    <h3 className="font-bold text-xl">Stage {index + 1}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold mb-1">Stage Name *</label>
                      <input
                        type="text"
                        value={round.round_name}
                        onChange={(e) => handleRoundChange(index, 'round_name', e.target.value)}
                        className="input-field"
                        placeholder="e.g., Preliminary Round, Semi-Finals, Grand Finale"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">📍 Location</label>
                      <input
                        type="text"
                        value={round.location}
                        onChange={(e) => handleRoundChange(index, 'location', e.target.value)}
                        className="input-field"
                        placeholder="e.g., Main Auditorium, Hall A"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">🕐 Start Date & Time *</label>
                      <input
                        type="datetime-local"
                        value={round.start_date}
                        onChange={(e) => handleRoundChange(index, 'start_date', e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold mb-1">🕐 End Date & Time (Optional)</label>
                      <input
                        type="datetime-local"
                        value={round.end_date}
                        onChange={(e) => handleRoundChange(index, 'end_date', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold mb-1">📝 Description</label>
                      <textarea
                        value={round.description}
                        onChange={(e) => handleRoundChange(index, 'description', e.target.value)}
                        className="input-field"
                        rows="2"
                        placeholder="Brief description of this stage..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 pt-4 border-t">
              <button type="submit" className="btn-primary flex-1">✓ Create Event with Stages</button>
              <button type="button" onClick={() => setStep(2)} className="btn-secondary">
                ← Back
              </button>
              <button type="button" onClick={skipRounds} className="btn-secondary">
                Skip Stages
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateEvent;
