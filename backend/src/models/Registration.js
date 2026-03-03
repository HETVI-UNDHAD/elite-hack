const supabase = require('../config/supabase');

class Registration {
  static async create(registrationData) {
    const { data, error } = await supabase
      .from('registrations')
      .insert([registrationData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findByUserAndEvent(userId, eventId) {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('user_id', userId)
      .eq('event_id', eventId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async findByEvent(eventId) {
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        *,
        users (id, name, email),
        teams (id, name, invite_code)
      `)
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async findByUser(userId) {
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        *,
        events (id, name, description, date, location, registration_deadline),
        teams (id, name, invite_code, leader_id)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // For each registration with a team, get team members
    for (let reg of data) {
      if (reg.teams) {
        const { data: members, error: membersError } = await supabase
          .from('registrations')
          .select(`
            users (id, name, email)
          `)
          .eq('team_id', reg.teams.id)
          .eq('status', 'approved');
        
        if (!membersError && members) {
          reg.teams.members = members.map(m => m.users);
        }
      }
    }
    
    return data;
  }

  static async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('registrations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async markAttendance(id, attended) {
    const { data, error } = await supabase
      .from('registrations')
      .update({ attended })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = Registration;
