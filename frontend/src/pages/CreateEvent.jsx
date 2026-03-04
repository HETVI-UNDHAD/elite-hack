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
    max_team_size: 1,
    fee: 0,
    organizer: '',
    category: '',
    subcategory: '',
    eligibility: '',
    image_url: ''
  });
  const [numRounds, setNumRounds] = useState('');
  const [rounds, setRounds] = useState([]);
  const [error, setError] = useState('');
  const [createdEventId, setCreatedEventId] = useState(null);

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate registration deadline is before event date
    if (new Date(formData.registration_deadline) >= new Date(formData.date)) {
      setError('Registration deadline must be before event date');
      return;
    }
    
    // Validate min team size is less than or equal to max team size
    if (formData.min_team_size > formData.max_team_size) {
      setError('Min team size cannot be greater than max team size');
      return;
    }
    
    // Validate fee is not negative
    if (formData.fee < 0) {
      setError('Fee cannot be negative');
      return;
    }
    
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
    if (num > 0 && num <= 5) {
      const initialRounds = Array.from({ length: num }, (_, i) => ({
        round_name: `Phase ${i + 1}`,
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
    setError('');
    
    // Validate each phase's end date is after start date
    for (let i = 0; i < rounds.length; i++) {
      if (rounds[i].end_date && new Date(rounds[i].end_date) <= new Date(rounds[i].start_date)) {
        setError(`Phase ${i + 1}: Submission deadline must be after start date`);
        return;
      }
    }
    
    // Validate phase dates are in chronological order
    for (let i = 0; i < rounds.length - 1; i++) {
      const currentPhaseEnd = new Date(rounds[i].end_date || rounds[i].start_date);
      const nextPhaseStart = new Date(rounds[i + 1].start_date);
      
      if (currentPhaseEnd >= nextPhaseStart) {
        setError(`Phase ${i + 2} start date must be after Phase ${i + 1} end date`);
        return;
      }
    }
    
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
            <label className="block text-sm font-medium mb-2">Event Image URL</label>
            <input
              type="url"
              className="input-field"
              placeholder="https://example.com/image.jpg"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">Enter image URL or leave blank for default</p>
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
                max={formData.date}
                onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Registration Fee (₹)</label>
              <input
                type="number"
                min="0"
                className="input-field"
                value={formData.fee}
                onChange={(e) => setFormData({ ...formData, fee: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Organizer</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Presidency University"
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Software Development"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sub-Category</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Web Development"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Eligibility</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., Undergraduate, Everyone can apply"
              value={formData.eligibility}
              onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
            />
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
                min={formData.min_team_size}
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
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="inline-block p-4 bg-blue-600 rounded-full mb-4">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Configure Event Phases</h3>
                <p className="text-gray-600">How many phases/rounds will this event have?</p>
              </div>
              
              <div className="max-w-md mx-auto">
                <label className="block text-lg font-semibold mb-3 text-gray-700">Number of Phases (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={numRounds}
                  onChange={(e) => setNumRounds(e.target.value)}
                  className="input-field text-2xl text-center font-bold"
                  placeholder="Enter 1-5"
                  required
                />
                <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700 font-semibold mb-2">💡 Examples:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>1 Phase:</strong> Single round event</li>
                    <li>• <strong>2 Phases:</strong> Preliminary + Finals</li>
                    <li>• <strong>3 Phases:</strong> Preliminary + Semi-Finals + Finals</li>
                    <li>• <strong>4-5 Phases:</strong> Multi-stage competitions</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button type="submit" className="btn-primary flex-1 text-lg py-3">Next: Configure Phases →</button>
              <button type="button" onClick={skipRounds} className="btn-secondary flex-1 text-lg py-3">
                Skip & Finish
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Round Details */}
        {step === 3 && (
          <form onSubmit={handleRoundsSubmit} className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-lg p-4 mb-4">
              <p className="text-center text-indigo-900 font-semibold">
                📅 Configure {rounds.length} Phase{rounds.length > 1 ? 's' : ''} - Define timeline and submission details
              </p>
            </div>
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {rounds.map((round, index) => (
                <div key={index} className="border-2 border-indigo-300 rounded-xl p-6 bg-gradient-to-br from-white to-indigo-50 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-4 mb-5 pb-4 border-b-2 border-indigo-200">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-2xl text-gray-800">Phase {index + 1}</h3>
                      <p className="text-sm text-gray-600">Define phase details and timeline</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-bold mb-2 text-gray-700 flex items-center gap-2">
                        <span className="text-indigo-600">🎯</span> Phase Name *
                      </label>
                      <input
                        type="text"
                        value={round.round_name}
                        onChange={(e) => handleRoundChange(index, 'round_name', e.target.value)}
                        className="input-field text-lg font-semibold"
                        placeholder="e.g., Preliminary Round, Semi-Finals, Grand Finale"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-700 flex items-center gap-2">
                        <span className="text-green-600">🕒</span> Start Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        value={round.start_date}
                        min={index > 0 ? rounds[index - 1].end_date || rounds[index - 1].start_date : ''}
                        onChange={(e) => handleRoundChange(index, 'start_date', e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-700 flex items-center gap-2">
                        <span className="text-red-600">⏰</span> Submission Deadline
                      </label>
                      <input
                        type="datetime-local"
                        value={round.end_date}
                        min={round.start_date}
                        onChange={(e) => handleRoundChange(index, 'end_date', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold mb-2 text-gray-700 flex items-center gap-2">
                        <span className="text-blue-600">📍</span> Location / Platform
                      </label>
                      <input
                        type="text"
                        value={round.location}
                        onChange={(e) => handleRoundChange(index, 'location', e.target.value)}
                        className="input-field"
                        placeholder="e.g., Main Auditorium, Online Platform, Hall A"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold mb-2 text-gray-700 flex items-center gap-2">
                        <span className="text-purple-600">📝</span> Phase Description & Submission Details
                      </label>
                      <textarea
                        value={round.description}
                        onChange={(e) => handleRoundChange(index, 'description', e.target.value)}
                        className="input-field"
                        rows="3"
                        placeholder="Describe this phase, submission requirements, evaluation criteria, etc."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 pt-4 border-t-2 border-gray-200">
              <button type="submit" className="btn-primary flex-1 text-lg py-3 shadow-lg">✓ Create Event with {rounds.length} Phase{rounds.length > 1 ? 's' : ''}</button>
              <button type="button" onClick={() => setStep(2)} className="btn-secondary py-3">
                ← Back
              </button>
              <button type="button" onClick={skipRounds} className="btn-secondary py-3">
                Skip Phases
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateEvent;
