import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isDeadlinePassed = new Date(event.registration_deadline) < new Date();

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-5 text-white">
        <h3 className="text-xl font-bold mb-1">{event.name}</h3>
        <p className="text-blue-50 text-sm line-clamp-2">{event.description}</p>
      </div>
      
      <div className="p-5">
        <div className="space-y-2.5 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📅</span>
            <div>
              <p className="text-xs text-gray-500">Event Date</p>
              <p className="text-sm font-semibold text-gray-800">{formatDate(event.date)}</p>
            </div>
          </div>
          
          {event.location && (
            <div className="flex items-center gap-2.5">
              <span className="text-xl">📍</span>
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-semibold text-gray-800">{event.location}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2.5">
            <span className="text-xl">⏰</span>
            <div>
              <p className="text-xs text-gray-500">Registration Deadline</p>
              <p className={`text-sm font-semibold ${
                isDeadlinePassed ? 'text-red-600' : 'text-gray-800'
              }`}>{formatDate(event.registration_deadline)}</p>
              {isDeadlinePassed && <span className="text-xs text-red-600 font-semibold">Closed</span>}
            </div>
          </div>
          
          <div className="flex items-center gap-2.5">
            <span className="text-xl">👥</span>
            <div>
              <p className="text-xs text-gray-500">Team Size</p>
              <p className="text-sm font-semibold text-gray-800">{event.min_team_size} - {event.max_team_size} members</p>
            </div>
          </div>
        </div>
        
        <Link 
          to={`/events/${event.id}`} 
          className="block w-full text-center bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
