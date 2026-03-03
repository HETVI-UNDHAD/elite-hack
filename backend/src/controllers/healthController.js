const supabase = require('../config/supabase');

exports.checkDatabase = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        return res.status(500).json({
          status: 'error',
          message: 'Database tables not found. Please run schema.sql in Supabase.',
          instructions: 'Go to Supabase Dashboard > SQL Editor > Run backend/database/schema.sql'
        });
      }
      throw error;
    }

    res.json({
      status: 'ok',
      message: 'Database is properly configured',
      supabaseConnected: true
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
