const supabase = require('../config/supabase');

class RequestReply {
  static async create(replyData) {
    const { data, error } = await supabase
      .from('request_replies')
      .insert([replyData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findByRequest(requestId) {
    const { data, error } = await supabase
      .from('request_replies')
      .select(`
        *,
        users (id, name)
      `)
      .eq('request_id', requestId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }
}

module.exports = RequestReply;
