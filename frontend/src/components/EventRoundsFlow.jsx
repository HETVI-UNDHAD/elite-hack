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

  const getDuration = (round) => {
    if (!round.end_date) return null;
    const start = new Date(round.start_date);
    const end = new Date(round.end_date);
    const diffMs = end - start;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHours > 0 ? `${diffHours}h` : ''}`;
    }
    return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-indigo-200">
      <div className="mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Event Phases
          </span>
        </h2>
      </div>
      
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-300 to-blue-300"></div>
        
        <div className="space-y-4">
          {rounds.map((round, index) => {
            const active = isRoundActive(round);
            const completed = isRoundCompleted(round);
            const duration = getDuration(round);
            
            return (
              <div key={round.id} className="relative flex items-start gap-3">
                <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border-2 shadow-sm ${
                  completed ? 'bg-green-500 border-green-600 text-white' :
                  active ? 'bg-blue-500 border-blue-600 text-white' :
                  'bg-gray-300 border-gray-400 text-gray-700'
                }`}>
                  {completed ? '✓' : index + 1}
                </div>
                
                <div className={`flex-1 border rounded-lg p-3 ${
                  completed ? 'bg-green-50 border-green-300' :
                  active ? 'bg-blue-50 border-blue-400' :
                  'bg-gray-50 border-gray-300'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-bold text-gray-900">{round.round_name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      completed ? 'bg-green-500 text-white' :
                      active ? 'bg-blue-500 text-white' :
                      'bg-gray-400 text-white'
                    }`}>
                      {completed ? '✓' : active ? '●' : '⏱'}
                    </span>
                  </div>
                  
                  {round.description && (
                    <p className="text-xs text-gray-600 mb-2">{round.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-semibold text-gray-600">🕐 Start:</span>
                      <p className="text-gray-900">{formatDate(round.start_date)}</p>
                    </div>
                    {round.end_date && (
                      <div>
                        <span className="font-semibold text-gray-600">⏰ Deadline:</span>
                        <p className="text-gray-900">{formatDate(round.end_date)}</p>
                      </div>
                    )}
                    {round.location && (
                      <div className="col-span-2">
                        <span className="font-semibold text-gray-600">📍 Location:</span>
                        <p className="text-gray-900">{round.location}</p>
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
