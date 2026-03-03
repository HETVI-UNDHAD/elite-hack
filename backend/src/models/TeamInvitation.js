const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

class TeamInvitation {
  static async create(invitationData) {
    const token = uuidv4();
    
    const { data, error } = await supabase
      .from('team_invitations')
      .insert([{
        ...invitationData,
        token,
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findByToken(token) {
    const { data, error } = await supabase
      .from('team_invitations')
      .select(`
        *,
        teams!inner (
          id,
          name,
          event_id,
          invite_code
        )
      `)
      .eq('token', token)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    // If we found the invitation, get the event details separately
    if (data && data.teams) {
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('id, name')
        .eq('id', data.teams.event_id)
        .single();
      
      if (!eventError && eventData) {
        data.teams.events = eventData;
      }
    }
    
    return data;
  }

  static async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('team_invitations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = TeamInvitation;
