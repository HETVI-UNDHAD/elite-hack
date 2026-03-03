const EventRoundsFlow = ({ rounds, eventDate }) => {
  if (!rounds || rounds.length === 0) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isRoundActive = (round) => {
    const now = new Date();
    const start = new Date(round.start_date);
    const end = round.end_date ? new Date(round.end_date) : null;
    
    if (end) {
      return now >= start && now <= end;
    }
    return now >= start;
  };

  const isRoundCompleted = (round) => {
    if (!round.end_date) return false;
    const now = new Date();
    const end = new Date(round.end_date);
    return now > end;
  };

  const isRoundUpcoming = (round) => {
    const now = new Date();
    const start = new Date(round.start_date);
    return now < start;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span>📅</span> Event Timeline
      </h2>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200"></div>
        
        <div className="space-y-6">
          {rounds.map((round, index) => {
            const active = isRoundActive(round);
            const completed = isRoundCompleted(round);
            const upcoming = isRoundUpcoming(round);
            
            return (
              <div key={round.id} className="relative flex items-start gap-4">
                {/* Timeline dot */}
                <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg border-4 ${
                  completed ? 'bg-green-500 border-green-600 text-white' :
                  active ? 'bg-blue-500 border-blue-600 text-white animate-pulse' :
                  'bg-gray-300 border-gray-400 text-gray-600'
                }`}>
                  {completed ? '✓' : index + 1}
                </div>
                
                {/* Round content */}
                <div className={`flex-1 border rounded-lg p-4 ${
                  completed ? 'bg-green-50 border-green-200' :
                  active ? 'bg-blue-50 border-blue-300 shadow-md' :
                  'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold">{round.round_name}</h3>
                      <p className="text-sm text-gray-600">Round {round.round_number}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      completed ? 'bg-green-200 text-green-800' :
                      active ? 'bg-blue-200 text-blue-800' :
                      'bg-gray-200 text-gray-700'
                    }`}>
                      {completed ? '✓ Completed' : active ? '● Live Now' : '⏱ Upcoming'}
                    </span>
                  </div>
                  
                  {round.description && (
                    <p className="text-gray-700 mb-3">{round.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-600">📍 Location:</span>
                      <p className="text-gray-800">{round.location || 'TBA'}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600">🕐 Start:</span>
                      <p className="text-gray-800">{formatDate(round.start_date)}</p>
                    </div>
                    {round.end_date && (
                      <div className="col-span-2">
                        <span className="font-semibold text-gray-600">🕐 End:</span>
                        <p className="text-gray-800">{formatDate(round.end_date)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventRoundsFlow;
