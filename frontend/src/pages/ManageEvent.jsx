import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import TeamRequestPanel from '../components/TeamRequestPanel';
import EventRoundsFlow from '../components/EventRoundsFlow';

const ManageEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [eventData, regData] = await Promise.all([
        eventService.getEventById(id),
        registrationService.getEventRegistrations(id)
      ]);
      setEvent(eventData);
      setRegistrations(regData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (regId, status) => {
    try {
      await registrationService.updateRegistrationStatus(regId, status);
      loadData();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleAttendance = async (regId, attended) => {
    try {
      await registrationService.markAttendance(regId, attended);
      loadData();
    } catch (error) {
      alert('Failed to mark attendance');
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{event?.name} - Manage Event</h1>
          </div>

          {event?.rounds && event.rounds.length > 0 && (
            <EventRoundsFlow rounds={event.rounds} eventDate={event.date} />
          )}

      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">Event Statistics</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">{event?.stats?.totalRegistrations || 0}</p>
            <p className="text-gray-600">Total</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{event?.stats?.approvedRegistrations || 0}</p>
            <p className="text-gray-600">Approved</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{event?.stats?.attendedCount || 0}</p>
            <p className="text-gray-600">Attended</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Registrations</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Team</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Attended</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg.id} className="border-b">
                  <td className="px-4 py-3">{reg.users?.name}</td>
                  <td className="px-4 py-3">{reg.users?.email}</td>
                  <td className="px-4 py-3">{reg.teams?.name || 'Individual'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-sm ${
                      reg.status === 'approved' ? 'bg-green-100 text-green-800' :
                      reg.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={reg.attended}
                      onChange={(e) => handleAttendance(reg.id, e.target.checked)}
                      className="w-5 h-5"
                    />
                  </td>
                  <td className="px-4 py-3">
                    {reg.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(reg.id, 'approved')}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(reg.id, 'rejected')}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div className="w-80">
      <TeamRequestPanel 
        eventId={id} 
        userTeamId={null}
        isTeamLeader={false}
        maxTeamSize={event?.max_team_size}
      />
    </div>
  </div>
    </div>
  );
};

export default ManageEvent;
