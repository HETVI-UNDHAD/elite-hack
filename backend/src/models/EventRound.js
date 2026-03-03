const supabase = require('../config/supabase');

class EventRound {
  static async create(roundData) {
    const { data, error } = await supabase
      .from('event_rounds')
      .insert([roundData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findByEvent(eventId) {
    const { data, error } = await supabase
      .from('event_rounds')
      .select('*')
      .eq('event_id', eventId)
      .order('round_number', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async update(id, roundData) {
    const { data, error } = await supabase
      .from('event_rounds')
      .update(roundData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('event_rounds')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async bulkCreate(rounds) {
    const { data, error } = await supabase
      .from('event_rounds')
      .insert(rounds)
      .select();

    if (error) throw error;
    return data;
  }
}

module.exports = EventRound;
