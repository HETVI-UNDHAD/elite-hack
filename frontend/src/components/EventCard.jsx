import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="card hover:shadow-xl transition-shadow">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{event.name}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
      
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Date:</span>
          <span>{formatDate(event.date)}</span>
        </div>
        {event.location && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">Location:</span>
            <span>{event.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="font-semibold">Registration Deadline:</span>
          <span>{formatDate(event.registration_deadline)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Team Size:</span>
          <span>{event.min_team_size} - {event.max_team_size}</span>
        </div>
      </div>
      
      <Link to={`/events/${event.id}`} className="btn-primary w-full text-center block">
        View Details
      </Link>
    </div>
  );
};

export default EventCard;
