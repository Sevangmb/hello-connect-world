import { supabase } from '@/integrations/supabase/client';
import { IOutfitRepository } from '../domain/interfaces/IOutfitRepository';
import { Outfit, OutfitItem, OutfitComment, OutfitStatus, OutfitCategory, OutfitSeason } from '../domain/types';

export class OutfitRepository implements IOutfitRepository {
  async createOutfit(outfit: Partial<Outfit>): Promise<Outfit> {
    try {
      // Ensure required properties are present
      const newOutfit = {
        name: outfit.name || 'New Outfit',
        user_id: outfit.user_id,
        status: outfit.status || 'draft',
        category: outfit.category || 'casual',
        season: outfit.season || 'all',
        is_favorite: outfit.is_favorite || false,
        likes_count: outfit.likes_count || 0,
        comments_count: outfit.comments_count || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...outfit
      };
      
      const { data, error } = await supabase
        .from('outfits')
        .insert([newOutfit])
        .select()
        .single();
      
      if (error) throw error;
      
      // Convert string status to OutfitStatus type
      return this.mapDbOutfitToOutfit(data);
    } catch (error) {
      console.error('Error creating outfit:', error);
      throw error;
    }
  }

  async getOutfitById(id: string): Promise<Outfit | null> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) return null;
      
      return this.mapDbOutfitToOutfit(data);
    } catch (error) {
      console.error(`Error fetching outfit with id ${id}:`, error);
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
      
      return (data || []).map(item => this.mapDbOutfitToOutfit(item));
    } catch (error) {
      console.error(`Error fetching outfits for user ${userId}:`, error);
      return [];
    }
  }

  async updateOutfit(id: string, outfit: Partial<Outfit>): Promise<Outfit> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .update({
          ...outfit,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return this.mapDbOutfitToOutfit(data);
    } catch (error) {
      console.error(`Error updating outfit ${id}:`, error);
      throw error;
    }
  }

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

  async likeOutfit(outfitId: string, userId: string): Promise<boolean> {
    try {
      // First, check if the user already liked this outfit
      const { data: existingLike, error: checkError } = await supabase
        .from('outfit_likes')
        .select('*')
        .eq('outfit_id', outfitId)
        .eq('user_id', userId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is the error code for "no rows returned"
        throw checkError;
      }
      
      if (existingLike) {
        // User already liked this outfit
        return true;
      }
      
      // Add the like
      const { error: insertError } = await supabase
        .from('outfit_likes')
        .insert([
          {
            outfit_id: outfitId,
            user_id: userId,
            created_at: new Date().toISOString()
          }
        ]);
      
      if (insertError) throw insertError;
      
      // Increment the likes count
      await supabase.rpc('increment_outfit_likes', {
        outfit_id: outfitId
      });
      
      return true;
    } catch (error) {
      console.error(`Error liking outfit ${outfitId} by user ${userId}:`, error);
      return false;
    }
  }

  async unlikeOutfit(outfitId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('outfit_likes')
        .delete()
        .eq('outfit_id', outfitId)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // Decrement the likes count
      await supabase.rpc('decrement_outfit_likes', {
        outfit_id: outfitId
      });
      
      return true;
    } catch (error) {
      console.error(`Error unliking outfit ${outfitId} by user ${userId}:`, error);
      return false;
    }
  }

  async addOutfitItem(outfitItem: OutfitItem): Promise<OutfitItem> {
    try {
      const { data, error } = await supabase
        .from('outfit_items')
        .insert([
          {
            ...outfitItem,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding outfit item:', error);
      throw error;
    }
  }

  async removeOutfitItem(itemId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('outfit_items')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error removing outfit item ${itemId}:`, error);
      return false;
    }
  }

  async getOutfitItems(outfitId: string): Promise<OutfitItem[]> {
    try {
      const { data, error } = await supabase
        .from('outfit_items')
        .select('*')
        .eq('outfit_id', outfitId);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching items for outfit ${outfitId}:`, error);
      return [];
    }
  }

  async getFeaturedOutfits(): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return (data || []).map(item => this.mapDbOutfitToOutfit(item));
    } catch (error) {
      console.error('Error fetching featured outfits:', error);
      return [];
    }
  }

  async getTrendingOutfits(): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .order('likes_count', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return (data || []).map(item => this.mapDbOutfitToOutfit(item));
    } catch (error) {
      console.error('Error fetching trending outfits:', error);
      return [];
    }
  }

  async getSimilarOutfits(outfitId: string): Promise<Outfit[]> {
    try {
      // Get the current outfit
      const { data: currentOutfit, error: outfitError } = await supabase
        .from('outfits')
        .select('*')
        .eq('id', outfitId)
        .single();
      
      if (outfitError) throw outfitError;
      
      // Find similar outfits by category or season
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .neq('id', outfitId)
        .or(`category.eq.${currentOutfit.category},season.eq.${currentOutfit.season}`)
        .limit(6);
      
      if (error) throw error;
      return (data || []).map(item => this.mapDbOutfitToOutfit(item));
    } catch (error) {
      console.error(`Error finding similar outfits to ${outfitId}:`, error);
      return [];
    }
  }

  async isOutfitLikedByUser(outfitId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('outfit_likes')
        .select('*')
        .eq('outfit_id', outfitId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error(`Error checking if outfit ${outfitId} is liked by user ${userId}:`, error);
      return false;
    }
  }

  async searchOutfits(query: string): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .ilike('name', `%${query}%`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(item => this.mapDbOutfitToOutfit(item));
    } catch (error) {
      console.error(`Error searching outfits with query "${query}":`, error);
      return [];
    }
  }
  
  async getAllOutfits(): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(item => this.mapDbOutfitToOutfit(item));
    } catch (error) {
      console.error('Error fetching all outfits:', error);
      return [];
    }
  }
  
  async getOutfitsByUserId(userId: string): Promise<Outfit[]> {
    return this.getUserOutfits(userId);
  }
  
  async getPublicOutfits(): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(item => this.mapDbOutfitToOutfit(item));
    } catch (error) {
      console.error('Error fetching public outfits:', error);
      return [];
    }
  }
  
  async hasUserLikedOutfit(outfitId: string, userId: string): Promise<boolean> {
    return this.isOutfitLikedByUser(outfitId, userId);
  }
  
  async addOutfitComment(outfitId: string, userId: string, content: string): Promise<OutfitComment | null> {
    try {
      const comment = {
        outfit_id: outfitId,
        user_id: userId,
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('outfit_comments')
        .insert([comment])
        .select()
        .single();
      
      if (error) throw error;
      
      // Increment comments count
      await supabase
        .from('outfits')
        .update({ comments_count: supabase.rpc('increment', { row_id: outfitId, table_name: 'outfits', column_name: 'comments_count' }) })
        .eq('id', outfitId);
      
      return data;
    } catch (error) {
      console.error(`Error adding comment to outfit ${outfitId}:`, error);
      return null;
    }
  }
  
  async getOutfitComments(outfitId: string): Promise<OutfitComment[]> {
    try {
      const { data, error } = await supabase
        .from('outfit_comments')
        .select('*, profiles(username, full_name, avatar_url)')
        .eq('outfit_id', outfitId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching comments for outfit ${outfitId}:`, error);
      return [];
    }
  }
  
  private mapDbOutfitToOutfit(data: any): Outfit {
    return {
      ...data,
      status: data.status as OutfitStatus,
      category: data.category as OutfitCategory,
      season: data.season as OutfitSeason
    };
  }
}
