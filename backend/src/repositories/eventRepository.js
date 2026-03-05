const { supabase } = require('../config/supabase');

class EventRepository {
  async create(eventData) {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async findAll() {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        registrations(count)
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async update(id, eventData) {
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  async getStats(eventId) {
    const { data, error } = await supabase
      .from('registrations')
      .select('status')
      .eq('event_id', eventId);
    if (error) throw error;
    return data;
  }
}

module.exports = new EventRepository();
