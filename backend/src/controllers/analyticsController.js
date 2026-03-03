const supabase = require('../config/supabase');

exports.getDashboardStats = async (req, res) => {
  try {
    const { count: totalEvents } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true });

    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'participant');

    const { count: totalRegistrations } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true });

    const { count: approvedRegistrations } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');

    const { data: recentEvents } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    res.json({
      totalEvents: totalEvents || 0,
      totalUsers: totalUsers || 0,
      totalRegistrations: totalRegistrations || 0,
      approvedRegistrations: approvedRegistrations || 0,
      recentEvents: recentEvents || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
