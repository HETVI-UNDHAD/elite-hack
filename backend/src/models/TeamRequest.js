const supabase = require('../config/supabase');

class TeamRequest {
  static async create(requestData) {
    const { data, error } = await supabase
      .from('team_member_requests')
      .insert([requestData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findByEvent(eventId) {
    const { data, error } = await supabase
      .from('team_member_requests')
      .select(`
        *,
        teams (id, name, invite_code),
        users (id, name, email)
      `)
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('team_member_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('team_member_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = TeamRequest;
