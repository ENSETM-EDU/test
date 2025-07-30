import { supabase } from '../lib/supabase';
import type { Member } from '../types';

export const memberService = {
  async getAll(): Promise<Member[]> {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async create(name: string): Promise<Member> {
    const { data, error } = await supabase
      .from('members')
      .insert({ name: name.trim() })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};