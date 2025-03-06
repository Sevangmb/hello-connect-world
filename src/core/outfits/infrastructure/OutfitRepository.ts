import { supabase } from '@/integrations/supabase/client';
import { Outfit, OutfitItem } from '@/core/outfits/domain/types';
import { IOutfitRepository } from '@/core/outfits/domain/interfaces/IOutfitRepository';
import type { OutfitItem as InfraOutfitItem } from './types';

export class OutfitRepository implements IOutfitRepository {
  async createOutfit(outfit: Outfit): Promise<Outfit> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .insert([
          {
            name: outfit.name,
            user_id: outfit.user_id,
            top_id: outfit.top_id,
            bottom_id: outfit.bottom_id,
            shoes_id: outfit.shoes_id,
            status: outfit.status,
            season: outfit.season,
            category: outfit.category,
            likes_count: outfit.likes_count || 0,
            created_at: outfit.created_at,
            updated_at: outfit.updated_at,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating outfit:', error);
        throw error;
      }

      return data as Outfit;
    } catch (error) {
      console.error('Error creating outfit:', error);
      throw error;
    }
  }

  async updateOutfit(outfit: Outfit): Promise<Outfit> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .update({
          name: outfit.name,
          user_id: outfit.user_id,
          top_id: outfit.top_id,
          bottom_id: outfit.bottom_id,
          shoes_id: outfit.shoes_id,
          status: outfit.status,
          season: outfit.season,
          category: outfit.category,
          likes_count: outfit.likes_count,
          created_at: outfit.created_at,
          updated_at: outfit.updated_at,
        })
        .eq('id', outfit.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating outfit:', error);
        throw error;
      }

      return data as Outfit;
    } catch (error) {
      console.error('Error updating outfit:', error);
      throw error;
    }
  }

  async deleteOutfit(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('outfits')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting outfit:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error deleting outfit:', error);
      return false;
    }
  }

  async getOutfitById(id: string): Promise<Outfit | null> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching outfit:', error);
        return null;
      }

      return data as Outfit;
    } catch (error) {
      console.error('Error fetching outfit:', error);
      return null;
    }
  }

  async getOutfitsByUserId(userId: string): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching outfits:', error);
        return [];
      }

      return data as Outfit[];
    } catch (error) {
      console.error('Error fetching outfits:', error);
      return [];
    }
  }

  async getAllOutfits(): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*');

      if (error) {
        console.error('Error fetching outfits:', error);
        return [];
      }

      return data as Outfit[];
    } catch (error) {
      console.error('Error fetching outfits:', error);
      return [];
    }
  }

  async addOutfitItem(outfitItem: OutfitItem): Promise<OutfitItem> {
    try {
      const { data, error } = await supabase
        .from('outfit_items')
        .insert([
          {
            outfit_id: outfitItem.outfit_id,
            item_id: outfitItem.item_id,
            item_type: outfitItem.item_type,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding outfit item:', error);
        throw error;
      }

      return data as OutfitItem;
    } catch (error) {
      console.error('Error adding outfit item:', error);
      throw error;
    }
  }

  async removeOutfitItem(outfitId: string, itemId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('outfit_items')
        .delete()
        .eq('outfit_id', outfitId)
        .eq('item_id', itemId);

      if (error) {
        console.error('Error removing outfit item:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error removing outfit item:', error);
      return false;
    }
  }

  async getOutfitItems(outfitId: string): Promise<OutfitItem[]> {
    try {
      const { data, error } = await supabase
        .from('outfit_items')
        .select('*')
        .eq('outfit_id', outfitId);

      if (error) {
        console.error('Error fetching outfit items:', error);
        return [];
      }

      return data as OutfitItem[];
    } catch (error) {
      console.error('Error fetching outfit items:', error);
      return [];
    }
  }

  async getOutfitsByStatus(status: string): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('status', status);

      if (error) {
        console.error('Error fetching outfits:', error);
        return [];
      }

      return data as Outfit[];
    } catch (error) {
      console.error('Error fetching outfits:', error);
      return [];
    }
  }

  async getOutfitsByCategory(category: string): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('category', category);

      if (error) {
        console.error('Error fetching outfits:', error);
        return [];
      }

      return data as Outfit[];
    } catch (error) {
      console.error('Error fetching outfits:', error);
      return [];
    }
  }

  async getOutfitsBySeason(season: string): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('season', season);

      if (error) {
        console.error('Error fetching outfits:', error);
        return [];
      }

      return data as Outfit[];
    } catch (error) {
      console.error('Error fetching outfits:', error);
      return [];
    }
  }

  async getTrendingOutfits(limit: number): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .order('likes_count', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching trending outfits:', error);
        return [];
      }

      return data as Outfit[];
    } catch (error) {
      console.error('Error fetching trending outfits:', error);
      return [];
    }
  }

  async getSimilarOutfits(outfitId: string, limit: number): Promise<Outfit[]> {
    try {
      // Basic implementation - can be improved with more sophisticated similarity logic
      const outfit = await this.getOutfitById(outfitId);
      if (!outfit) return [];

      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .neq('id', outfitId)
        .eq('category', outfit.category)
        .limit(limit);

      if (error) {
        console.error('Error fetching similar outfits:', error);
        return [];
      }

      return data as Outfit[];
    } catch (error) {
      console.error('Error fetching similar outfits:', error);
      return [];
    }
  }

  async searchOutfits(query: string): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .ilike('name', `%${query}%`);

      if (error) {
        console.error('Error searching outfits:', error);
        return [];
      }

      return data as Outfit[];
    } catch (error) {
      console.error('Error searching outfits:', error);
      return [];
    }
  }

  async incrementLikes(outfitId: string): Promise<number> {
    try {
      // Update the likes count in the outfits table
      const { data, error } = await supabase
        .from('outfits')
        .update({ likes_count: supabase.rpc('increment_outfit_likes', { outfit_id: outfitId }) })
        .eq('id', outfitId)
        .select('likes_count')
        .single();

      if (error) throw error;
      return data.likes_count as number;
    } catch (error) {
      console.error(`Error incrementing likes for outfit ${outfitId}:`, error);
      return 0;
    }
  }

  async decrementLikes(outfitId: string): Promise<number> {
    try {
      // Update the likes count in the outfits table
      const { data, error } = await supabase
        .from('outfits')
        .update({ likes_count: supabase.rpc('decrement_outfit_likes', { outfit_id: outfitId }) })
        .eq('id', outfitId)
        .select('likes_count')
        .single();

      if (error) throw error;
      return data.likes_count as number;
    } catch (error) {
      console.error(`Error decrementing likes for outfit ${outfitId}:`, error);
      return 0;
    }
  }

  async getOutfitsWithFilters(filters: {
    userId?: string;
    status?: string;
    category?: string;
    season?: string;
    query?: string;
    minLikes?: number;
    maxLikes?: number;
  }): Promise<Outfit[]> {
    try {
      let queryBuilder = supabase.from('outfits').select('*');

      if (filters.userId) {
        queryBuilder = queryBuilder.eq('user_id', filters.userId);
      }
      if (filters.status) {
        queryBuilder = queryBuilder.eq('status', filters.status);
      }
      if (filters.category) {
        queryBuilder = queryBuilder.eq('category', filters.category);
      }
      if (filters.season) {
        queryBuilder = queryBuilder.eq('season', filters.season);
      }
      if (filters.query) {
        queryBuilder = queryBuilder.ilike('name', `%${filters.query}%`);
      }
     if (filters.minLikes) {
        queryBuilder = queryBuilder.gte('likes_count', filters.minLikes);
      }
      if (filters.maxLikes) {
        queryBuilder = queryBuilder.lte('likes_count', filters.maxLikes);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error('Error fetching outfits with filters:', error);
        return [];
      }

      return data as Outfit[];
    } catch (error) {
      console.error('Error fetching outfits with filters:', error);
      return [];
    }
  }
}
