import { supabase } from '../lib/supabase';
import type { Pairing } from '../types';

export const pairingService = {
  async getAll(): Promise<Pairing[]> {
    const { data, error } = await supabase
      .from('pairings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getLatest(): Promise<Pairing | null> {
    const { data, error } = await supabase
      .from('pairings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async create(pairs: [string, string][]): Promise<Pairing> {
    const { data, error } = await supabase
      .from('pairings')
      .insert({ 
        pairs,
        date: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAllPairs(): Promise<string[][]> {
    const { data, error } = await supabase
      .from('pairings')
      .select('pairs');
    
    if (error) throw error;
    return data?.flatMap(p => p.pairs) || [];
  }
};