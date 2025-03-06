import { supabase } from '@/integrations/supabase/client';
import { IOutfitRepository } from '../domain/interfaces/IOutfitRepository';
import { Outfit, OutfitItem } from '../domain/types';

export class OutfitRepository implements IOutfitRepository {
  async getOutfitById(id: string): Promise<Outfit | null> {
    const { data, error } = await supabase
      .from('outfits')
      .select(`
        *,
        profiles:user_id (
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data as unknown as Outfit;
  }

  async getOutfitItems(outfitId: string): Promise<OutfitItem[]> {
    const { data, error } = await supabase
      .from('outfit_items')
      .select('*')
      .eq('outfit_id', outfitId)
      .order('position');

    if (error) return [];
    return data as OutfitItem[];
  }

  async createOutfit(outfit: Partial<Outfit>): Promise<Outfit | null> {
    const { data, error } = await supabase
      .from('outfits')
      .insert({
        ...outfit,
        status: outfit.status || 'draft',
        category: outfit.category || 'casual',
        season: outfit.season || 'all',
        is_favorite: outfit.is_favorite || false
      })
      .select()
      .single();

    if (error || !data) return null;
    return data as Outfit;
  }

  async updateOutfit(id: string, updates: Partial<Outfit>): Promise<Outfit | null> {
    const { data, error } = await supabase
      .from('outfits')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return null;
    return data as Outfit;
  }

  async deleteOutfit(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('outfits')
      .delete()
      .eq('id', id);

    return !error;
  }

  async getUserOutfits(userId: string): Promise<Outfit[]> {
    const { data, error } = await supabase
      .from('outfits')
      .select(`
        *,
        profiles:user_id (
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data as unknown as Outfit[];
  }

  async addOutfitItem(outfitItem: Omit<OutfitItem, 'id' | 'created_at'>): Promise<OutfitItem | null> {
    const { data, error } = await supabase
      .from('outfit_items')
      .insert(outfitItem)
      .select()
      .single();

    if (error || !data) return null;
    return data as OutfitItem;
  }

  async updateOutfitItem(id: string, updates: Partial<OutfitItem>): Promise<OutfitItem | null> {
    const { data, error } = await supabase
      .from('outfit_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return null;
    return data as OutfitItem;
  }

  async deleteOutfitItem(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('outfit_items')
      .delete()
      .eq('id', id);

    return !error;
  }
}
