
import { supabase } from '@/integrations/supabase/client';
import { Outfit, OutfitComment, OutfitItem, OutfitStatus, OutfitCategory, OutfitSeason } from '@/core/outfits/domain/types';
import { IOutfitRepository } from '@/core/outfits/domain/interfaces/IOutfitRepository';
import { InfraOutfitItem } from './types';

export class OutfitRepository implements IOutfitRepository {
  async createOutfit(outfitData: Partial<Outfit>): Promise<Outfit> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .insert([
          {
            name: outfitData.name,
            user_id: outfitData.user_id,
            top_id: outfitData.top_id,
            bottom_id: outfitData.bottom_id,
            shoes_id: outfitData.shoes_id,
            status: outfitData.status,
            season: outfitData.season,
            category: outfitData.category,
            likes_count: outfitData.likes_count || 0,
            comments_count: outfitData.comments_count || 0,
            is_favorite: outfitData.is_favorite || false
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating outfit:', error);
        throw error;
      }

      // Type cast to ensure it matches Outfit type
      return data as unknown as Outfit;
    } catch (error) {
      console.error('Error creating outfit:', error);
      throw error;
    }
  }

  async updateOutfit(id: string, outfitData: Partial<Outfit>): Promise<Outfit> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .update({
          name: outfitData.name,
          user_id: outfitData.user_id,
          top_id: outfitData.top_id,
          bottom_id: outfitData.bottom_id,
          shoes_id: outfitData.shoes_id,
          status: outfitData.status,
          season: outfitData.season,
          category: outfitData.category,
          likes_count: outfitData.likes_count,
          comments_count: outfitData.comments_count,
          is_favorite: outfitData.is_favorite,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating outfit:', error);
        throw error;
      }

      return data as unknown as Outfit;
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

      return data as unknown as Outfit;
    } catch (error) {
      console.error('Error fetching outfit:', error);
      return null;
    }
  }

  async getUserOutfits(userId: string): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching outfits:', error);
        return [];
      }

      return data as unknown as Outfit[];
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

      return data as unknown as Outfit[];
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
            clothes_id: outfitItem.clothes_id,
            position: outfitItem.position || 0
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding outfit item:', error);
        throw error;
      }

      return data as unknown as OutfitItem;
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

      return data as unknown as OutfitItem[];
    } catch (error) {
      console.error('Error fetching outfit items:', error);
      return [];
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

      return data as unknown as Outfit[];
    } catch (error) {
      console.error('Error fetching outfits:', error);
      return [];
    }
  }

  async getPublicOutfits(): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('status', 'published');

      if (error) {
        console.error('Error fetching public outfits:', error);
        return [];
      }

      return data as unknown as Outfit[];
    } catch (error) {
      console.error('Error fetching public outfits:', error);
      return [];
    }
  }

  async getTrendingOutfits(): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('status', 'published')
        .order('likes_count', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching trending outfits:', error);
        return [];
      }

      return data as unknown as Outfit[];
    } catch (error) {
      console.error('Error fetching trending outfits:', error);
      return [];
    }
  }

  async getSimilarOutfits(outfitId: string): Promise<Outfit[]> {
    try {
      // Basic implementation - can be improved with more sophisticated similarity logic
      const outfit = await this.getOutfitById(outfitId);
      if (!outfit) return [];

      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .neq('id', outfitId)
        .eq('category', outfit.category)
        .limit(5);

      if (error) {
        console.error('Error fetching similar outfits:', error);
        return [];
      }

      return data as unknown as Outfit[];
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

      return data as unknown as Outfit[];
    } catch (error) {
      console.error('Error searching outfits:', error);
      return [];
    }
  }

  async likeOutfit(outfitId: string, userId: string): Promise<boolean> {
    try {
      // First, check if the user has already liked the outfit
      const { data: existingLike, error: checkError } = await supabase
        .from('outfit_likes')
        .select('*')
        .eq('outfit_id', outfitId)
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingLike) {
        return true; // Already liked
      }

      // Add a new like record
      const { error: insertError } = await supabase
        .from('outfit_likes')
        .insert([
          { outfit_id: outfitId, user_id: userId }
        ]);

      if (insertError) throw insertError;

      // Update the likes count
      const { error: updateError } = await supabase
        .from('outfits')
        .update({ 
          likes_count: supabase.rpc('increment', { row_id: outfitId, table: 'outfits', column: 'likes_count' })
        })
        .eq('id', outfitId);

      if (updateError) throw updateError;
      
      return true;
    } catch (error) {
      console.error(`Error liking outfit ${outfitId}:`, error);
      return false;
    }
  }

  async unlikeOutfit(outfitId: string, userId: string): Promise<boolean> {
    try {
      // Remove the like record
      const { error: deleteError } = await supabase
        .from('outfit_likes')
        .delete()
        .eq('outfit_id', outfitId)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Update the likes count
      const { error: updateError } = await supabase
        .from('outfits')
        .update({ 
          likes_count: supabase.rpc('decrement', { row_id: outfitId, table: 'outfits', column: 'likes_count' })
        })
        .eq('id', outfitId);

      if (updateError) throw updateError;
      
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

  async addOutfitComment(outfitId: string, userId: string, content: string): Promise<OutfitComment | null> {
    try {
      const { data, error } = await supabase
        .from('outfit_comments')
        .insert([
          { outfit_id: outfitId, user_id: userId, content }
        ])
        .select(`
          *,
          profiles (
            username,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Update comments count
      await supabase
        .from('outfits')
        .update({ comments_count: supabase.rpc('increment', { row_id: outfitId, table: 'outfits', column: 'comments_count' }) })
        .eq('id', outfitId);

      return data as unknown as OutfitComment;
    } catch (error) {
      console.error(`Error adding comment to outfit ${outfitId}:`, error);
      return null;
    }
  }

  async getOutfitComments(outfitId: string): Promise<OutfitComment[]> {
    try {
      const { data, error } = await supabase
        .from('outfit_comments')
        .select(`
          *,
          profiles (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('outfit_id', outfitId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data as unknown as OutfitComment[];
    } catch (error) {
      console.error(`Error fetching comments for outfit ${outfitId}:`, error);
      return [];
    }
  }

  async getFeaturedOutfits(): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching featured outfits:', error);
        return [];
      }

      return data as unknown as Outfit[];
    } catch (error) {
      console.error('Error fetching featured outfits:', error);
      return [];
    }
  }
}
