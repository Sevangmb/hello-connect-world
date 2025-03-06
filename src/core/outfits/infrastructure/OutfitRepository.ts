
import { supabase } from '@/integrations/supabase/client';
import { IOutfitRepository } from '../domain/interfaces/IOutfitRepository';
import { Outfit, OutfitStatus } from '../domain/types';

export type OutfitCategory = 'casual' | 'formal' | 'sport' | 'business' | 'other';
export type OutfitSeason = 'spring' | 'summer' | 'autumn' | 'winter' | 'all';

export interface OutfitItem {
  id?: string;
  outfit_id: string;
  clothes_id: string;
  position?: number;
  created_at?: string;
}

export class OutfitRepository implements IOutfitRepository {
  async createOutfit(outfit: Outfit): Promise<Outfit> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .insert({
          user_id: outfit.user_id,
          name: outfit.name,
          description: outfit.description,
          status: outfit.status,
          category: outfit.category,
          season: outfit.season,
          is_favorite: outfit.is_favorite,
          top_id: outfit.top_id,
          bottom_id: outfit.bottom_id,
          shoes_id: outfit.shoes_id,
          image_url: outfit.image_url,
          likes_count: outfit.likes_count || 0,
          comments_count: outfit.comments_count || 0
        })
        .select('*')
        .single();

      if (error) throw error;
      return data as Outfit;
    } catch (error) {
      console.error('Error creating outfit:', error);
      throw error;
    }
  }

  async getOutfit(id: string): Promise<Outfit | null> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*, profiles:user_id(username, full_name, avatar_url)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Outfit;
    } catch (error) {
      console.error(`Error fetching outfit ${id}:`, error);
      return null;
    }
  }

  async getUserOutfits(userId: string): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Outfit[];
    } catch (error) {
      console.error(`Error fetching outfits for user ${userId}:`, error);
      return [];
    }
  }

  async updateOutfit(outfit: Partial<Outfit>): Promise<Outfit | null> {
    try {
      if (!outfit.id) {
        throw new Error('Outfit ID is required for update');
      }

      const { data, error } = await supabase
        .from('outfits')
        .update({
          name: outfit.name,
          description: outfit.description,
          status: outfit.status,
          category: outfit.category,
          season: outfit.season,
          is_favorite: outfit.is_favorite,
          top_id: outfit.top_id,
          bottom_id: outfit.bottom_id,
          shoes_id: outfit.shoes_id,
          image_url: outfit.image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', outfit.id)
        .select('*')
        .single();

      if (error) throw error;
      return data as Outfit;
    } catch (error) {
      console.error(`Error updating outfit ${outfit.id}:`, error);
      return null;
    }
  }

  async deleteOutfit(id: string): Promise<boolean> {
    try {
      // First delete related outfit items
      const { error: itemsError } = await supabase
        .from('outfit_items')
        .delete()
        .eq('outfit_id', id);

      if (itemsError) throw itemsError;

      // Then delete the outfit
      const { error } = await supabase
        .from('outfits')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting outfit ${id}:`, error);
      return false;
    }
  }

  async addOutfitItem(item: Omit<OutfitItem, 'created_at' | 'id'>): Promise<OutfitItem | null> {
    try {
      const { data, error } = await supabase
        .from('outfit_items')
        .insert({
          outfit_id: item.outfit_id,
          clothes_id: item.clothes_id,
          position: item.position || 0
        })
        .select('*')
        .single();

      if (error) throw error;
      return data as OutfitItem;
    } catch (error) {
      console.error('Error adding outfit item:', error);
      return null;
    }
  }

  async removeOutfitItem(outfitId: string, clothesId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('outfit_items')
        .delete()
        .eq('outfit_id', outfitId)
        .eq('clothes_id', clothesId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error removing item from outfit ${outfitId}:`, error);
      return false;
    }
  }

  async getOutfitItems(outfitId: string): Promise<OutfitItem[]> {
    try {
      const { data, error } = await supabase
        .from('outfit_items')
        .select('*')
        .eq('outfit_id', outfitId)
        .order('position', { ascending: true });

      if (error) throw error;
      return data as OutfitItem[];
    } catch (error) {
      console.error(`Error fetching items for outfit ${outfitId}:`, error);
      return [];
    }
  }

  async likeOutfit(outfitId: string, userId: string): Promise<boolean> {
    try {
      // First check if the user already liked this outfit
      const { data: existingLike, error: checkError } = await supabase
        .from('outfit_likes')
        .select('*')
        .eq('outfit_id', outfitId)
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is expected if user hasn't liked yet
        throw checkError;
      }

      if (existingLike) {
        return true; // User already liked this outfit
      }

      // Add the like
      const { error: likeError } = await supabase
        .from('outfit_likes')
        .insert({
          outfit_id: outfitId,
          user_id: userId
        });

      if (likeError) throw likeError;

      // Increment the likes count using the RPC function
      await supabase.rpc('increment_outfit_likes', { outfit_id: outfitId });

      return true;
    } catch (error) {
      console.error(`Error liking outfit ${outfitId}:`, error);
      return false;
    }
  }

  async unlikeOutfit(outfitId: string, userId: string): Promise<boolean> {
    try {
      // Remove the like
      const { error: unlikeError } = await supabase
        .from('outfit_likes')
        .delete()
        .eq('outfit_id', outfitId)
        .eq('user_id', userId);

      if (unlikeError) throw unlikeError;

      // Decrement the likes count using the RPC function
      await supabase.rpc('decrement_outfit_likes', { outfit_id: outfitId });

      return true;
    } catch (error) {
      console.error(`Error unliking outfit ${outfitId}:`, error);
      return false;
    }
  }

  async hasUserLikedOutfit(outfitId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('outfit_likes')
        .select('*')
        .eq('outfit_id', outfitId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error(`Error checking if user ${userId} liked outfit ${outfitId}:`, error);
      return false;
    }
  }

  async incrementLikes(outfitId: string): Promise<number> {
    try {
      // First get the current likes count
      const { data: outfit, error: getError } = await supabase
        .from('outfits')
        .select('likes_count')
        .eq('id', outfitId)
        .single();
      
      if (getError) throw getError;
      
      const currentLikes = outfit?.likes_count || 0;
      const newLikes = currentLikes + 1;
      
      // Update the likes count
      const { error: updateError } = await supabase
        .from('outfits')
        .update({ likes_count: newLikes })
        .eq('id', outfitId);
      
      if (updateError) throw updateError;
      
      // Call the RPC function to record this interaction
      await supabase.rpc('increment_outfit_likes', { outfit_id: outfitId });
      
      return newLikes;
    } catch (error) {
      console.error('Error incrementing outfit likes:', error);
      return 0;
    }
  }

  async getFavoritedOutfits(userId: string): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('user_id', userId)
        .eq('is_favorite', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Outfit[];
    } catch (error) {
      console.error(`Error fetching favorited outfits for user ${userId}:`, error);
      return [];
    }
  }

  async searchOutfits(query: string): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*, profiles:user_id(username, full_name, avatar_url)')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Outfit[];
    } catch (error) {
      console.error(`Error searching outfits with query "${query}":`, error);
      return [];
    }
  }

  async getPublicOutfits(limit: number = 20, offset: number = 0): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*, profiles:user_id(username, full_name, avatar_url)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data as Outfit[];
    } catch (error) {
      console.error('Error fetching public outfits:', error);
      return [];
    }
  }

  async getTrendingOutfits(limit: number = 10): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*, profiles:user_id(username, full_name, avatar_url)')
        .eq('status', 'published')
        .order('likes_count', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as Outfit[];
    } catch (error) {
      console.error('Error fetching trending outfits:', error);
      return [];
    }
  }

  async getOutfitsBySeason(season: OutfitSeason, limit: number = 20): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*, profiles:user_id(username, full_name, avatar_url)')
        .eq('status', 'published')
        .eq('season', season)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as Outfit[];
    } catch (error) {
      console.error(`Error fetching outfits for season ${season}:`, error);
      return [];
    }
  }

  async getOutfitsByCategory(category: OutfitCategory, limit: number = 20): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*, profiles:user_id(username, full_name, avatar_url)')
        .eq('status', 'published')
        .eq('category', category)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as Outfit[];
    } catch (error) {
      console.error(`Error fetching outfits for category ${category}:`, error);
      return [];
    }
  }
}
