const supabase = require('../config/supabase');

class JoinRequest {
  static async create(requestData) {
    const { data, error } = await supabase
      .from('join_requests')
      .insert([requestData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findByTeam(teamId) {
    const { data, error } = await supabase
      .from('join_requests')
      .select(`
        *,
        users (id, name, email)
      `)
      .eq('team_id', teamId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('join_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('join_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = JoinRequest;
