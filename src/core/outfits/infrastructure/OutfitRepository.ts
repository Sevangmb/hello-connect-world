
import { supabase } from '@/integrations/supabase/client';
import { IOutfitRepository } from '../domain/interfaces/IOutfitRepository';
import { Outfit, OutfitComment, OutfitItem, OutfitStatus, OutfitCategory, OutfitSeason } from '../domain/types';

export class OutfitRepository implements IOutfitRepository {
  /**
   * Get all outfits
   */
  async getAllOutfits(): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*, profiles(username, full_name, avatar_url)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Outfit[];
    } catch (error) {
      console.error('Error fetching outfits:', error);
      return [];
    }
  }

  /**
   * Get an outfit by ID
   */
  async getOutfitById(id: string): Promise<Outfit | null> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*, profiles(username, full_name, avatar_url)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Outfit;
    } catch (error) {
      console.error(`Error fetching outfit ${id}:`, error);
      return null;
    }
  }

  /**
   * Create a new outfit
   */
  async createOutfit(outfit: Partial<Outfit>): Promise<Outfit | null> {
    try {
      // Ensure required fields have values
      const outfitData = {
        user_id: outfit.user_id,
        name: outfit.name || 'New Outfit',
        description: outfit.description,
        status: outfit.status || 'draft' as OutfitStatus,
        category: outfit.category || 'casual' as OutfitCategory,
        season: outfit.season || 'all' as OutfitSeason,
        is_favorite: outfit.is_favorite || false,
        top_id: outfit.top_id,
        bottom_id: outfit.bottom_id,
        shoes_id: outfit.shoes_id,
        likes_count: outfit.likes_count || 0,
        comments_count: outfit.comments_count || 0,
        image_url: outfit.image_url
      };

      const { data, error } = await supabase
        .from('outfits')
        .insert(outfitData)
        .select()
        .single();

      if (error) throw error;
      return data as Outfit;
    } catch (error) {
      console.error('Error creating outfit:', error);
      return null;
    }
  }

  /**
   * Update an existing outfit
   */
  async updateOutfit(id: string, outfit: Partial<Outfit>): Promise<Outfit | null> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .update(outfit)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Outfit;
    } catch (error) {
      console.error(`Error updating outfit ${id}:`, error);
      return null;
    }
  }

  /**
   * Delete an outfit
   */
  async deleteOutfit(id: string): Promise<boolean> {
    try {
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

  /**
   * Add an item to an outfit
   */
  async addOutfitItem(outfitItem: OutfitItem): Promise<OutfitItem | null> {
    try {
      const { data, error } = await supabase
        .from('outfit_items')
        .insert({
          outfit_id: outfitItem.outfit_id,
          clothes_id: outfitItem.clothes_id,
          position: outfitItem.position
        })
        .select()
        .single();

      if (error) throw error;
      return data as OutfitItem;
    } catch (error) {
      console.error('Error adding outfit item:', error);
      return null;
    }
  }

  /**
   * Get items for an outfit
   */
  async getOutfitItems(outfitId: string): Promise<OutfitItem[]> {
    try {
      const { data, error } = await supabase
        .from('outfit_items')
        .select('*')
        .eq('outfit_id', outfitId)
        .order('position');

      if (error) throw error;
      return data as OutfitItem[];
    } catch (error) {
      console.error(`Error fetching items for outfit ${outfitId}:`, error);
      return [];
    }
  }

  /**
   * Remove an item from an outfit
   */
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

  /**
   * Get outfits by user ID
   */
  async getOutfitsByUserId(userId: string): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*, profiles(username, full_name, avatar_url)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Outfit[];
    } catch (error) {
      console.error(`Error fetching outfits for user ${userId}:`, error);
      return [];
    }
  }

  /**
   * Get public outfits
   */
  async getPublicOutfits(): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*, profiles(username, full_name, avatar_url)')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Outfit[];
    } catch (error) {
      console.error('Error fetching public outfits:', error);
      return [];
    }
  }

  /**
   * Get trending outfits
   */
  async getTrendingOutfits(): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*, profiles(username, full_name, avatar_url)')
        .eq('status', 'published')
        .order('likes_count', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Outfit[];
    } catch (error) {
      console.error('Error fetching trending outfits:', error);
      return [];
    }
  }

  /**
   * Search outfits
   */
  async searchOutfits(query: string): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*, profiles(username, full_name, avatar_url)')
        .eq('status', 'published')
        .ilike('name', `%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Outfit[];
    } catch (error) {
      console.error(`Error searching outfits for "${query}":`, error);
      return [];
    }
  }

  /**
   * Like an outfit
   */
  async likeOutfit(outfitId: string, userId: string): Promise<boolean> {
    try {
      // First check if the user already liked this outfit
      const { data: existingLike, error: checkError } = await supabase
        .from('outfit_likes')
        .select('id')
        .eq('outfit_id', outfitId)
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // Error other than "no rows returned"
        throw checkError;
      }

      if (existingLike) {
        // User already liked this outfit
        return false;
      }

      // Add the like
      const { error: insertError } = await supabase
        .from('outfit_likes')
        .insert({ outfit_id: outfitId, user_id: userId });

      if (insertError) throw insertError;

      // Increment the likes count
      await supabase.rpc('increment_outfit_likes', { outfit_id: outfitId });

      return true;
    } catch (error) {
      console.error(`Error liking outfit ${outfitId}:`, error);
      return false;
    }
  }

  /**
   * Unlike an outfit
   */
  async unlikeOutfit(outfitId: string, userId: string): Promise<boolean> {
    try {
      // Remove the like
      const { error: deleteError } = await supabase
        .from('outfit_likes')
        .delete()
        .eq('outfit_id', outfitId)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Decrement the likes count
      await supabase.rpc('decrement_outfit_likes', { outfit_id: outfitId });

      return true;
    } catch (error) {
      console.error(`Error unliking outfit ${outfitId}:`, error);
      return false;
    }
  }

  /**
   * Check if user has liked an outfit
   */
  async hasUserLikedOutfit(outfitId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('outfit_likes')
        .select('id')
        .eq('outfit_id', outfitId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // Error other than "no rows returned"
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error(`Error checking if user ${userId} liked outfit ${outfitId}:`, error);
      return false;
    }
  }

  /**
   * Add a comment to an outfit
   */
  async addOutfitComment(outfitId: string, userId: string, content: string): Promise<OutfitComment | null> {
    try {
      const { data, error } = await supabase
        .from('outfit_comments')
        .insert({ outfit_id: outfitId, user_id: userId, content })
        .select('*, profiles(username, full_name, avatar_url)')
        .single();

      if (error) throw error;

      // Increment comments count
      await supabase
        .from('outfits')
        .update({ comments_count: supabase.rpc('increment', { value: 1 }) })
        .eq('id', outfitId);

      return data as OutfitComment;
    } catch (error) {
      console.error(`Error adding comment to outfit ${outfitId}:`, error);
      return null;
    }
  }

  /**
   * Get comments for an outfit
   */
  async getOutfitComments(outfitId: string): Promise<OutfitComment[]> {
    try {
      const { data, error } = await supabase
        .from('outfit_comments')
        .select('*, profiles(username, full_name, avatar_url)')
        .eq('outfit_id', outfitId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as OutfitComment[];
    } catch (error) {
      console.error(`Error fetching comments for outfit ${outfitId}:`, error);
      return [];
    }
  }
}
