const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

class Team {
  static async create(teamData) {
    const inviteCode = uuidv4().substring(0, 8).toUpperCase();
    
    const { data, error } = await supabase
      .from('teams')
      .insert([{
        ...teamData,
        invite_code: inviteCode
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async findByInviteCode(inviteCode) {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('invite_code', inviteCode)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async getMembers(teamId) {
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        *,
        users (id, name, email)
      `)
      .eq('team_id', teamId);

    if (error) throw error;
    return data.map(reg => ({
      ...reg.users,
      user_id: reg.users.id
    }));
  }

  static async getMemberCount(teamId) {
    const { count, error } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('team_id', teamId);

    if (error) throw error;
    return count || 0;
  }

  static async getPendingInvitationsCount(teamId) {
    const { count, error } = await supabase
      .from('team_invitations')
      .select('*', { count: 'exact', head: true })
      .eq('team_id', teamId)
      .eq('status', 'pending');

    if (error) throw error;
    return count || 0;
  }

  static async getTotalCommittedCount(teamId) {
    const memberCount = await this.getMemberCount(teamId);
    const pendingCount = await this.getPendingInvitationsCount(teamId);
    return memberCount + pendingCount;
  }
}

module.exports = Team;
