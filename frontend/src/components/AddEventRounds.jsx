import { useState } from 'react';

const AddEventRounds = ({ eventId, eventDate, onClose, onSuccess }) => {
  const [numRounds, setNumRounds] = useState('');
  const [rounds, setRounds] = useState([]);
  const [step, setStep] = useState(1);

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
      setStep(2);
    }
  };

  const handleRoundChange = (index, field, value) => {
    const updated = [...rounds];
    updated[index][field] = value;
    setRounds(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events/${eventId}/rounds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ rounds })
      });

      if (!response.ok) throw new Error('Failed to add rounds');
      
      alert('Event rounds added successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      alert('Failed to add rounds: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Add Event Rounds</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
          </div>

          {step === 1 && (
            <form onSubmit={handleNumRoundsSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">How many rounds/stages does this event have?</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={numRounds}
                  onChange={(e) => setNumRounds(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter number of rounds (1-10)"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary">Next</button>
                <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {rounds.map((round, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-bold text-lg mb-3">Round {index + 1}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Round Name *</label>
                        <input
                          type="text"
                          value={round.round_name}
                          onChange={(e) => handleRoundChange(index, 'round_name', e.target.value)}
                          className="w-full px-3 py-2 border rounded"
                          placeholder="e.g., Preliminary Round"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input
                          type="text"
                          value={round.location}
                          onChange={(e) => handleRoundChange(index, 'location', e.target.value)}
                          className="w-full px-3 py-2 border rounded"
                          placeholder="e.g., Hall A"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Start Date & Time *</label>
                        <input
                          type="datetime-local"
                          value={round.start_date}
                          onChange={(e) => handleRoundChange(index, 'start_date', e.target.value)}
                          className="w-full px-3 py-2 border rounded"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">End Date & Time</label>
                        <input
                          type="datetime-local"
                          value={round.end_date}
                          onChange={(e) => handleRoundChange(index, 'end_date', e.target.value)}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          value={round.description}
                          onChange={(e) => handleRoundChange(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border rounded"
                          rows="2"
                          placeholder="Brief description of this round"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" className="btn-primary">Save Rounds</button>
                <button type="button" onClick={() => setStep(1)} className="btn-secondary">Back</button>
                <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEventRounds;
