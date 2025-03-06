// Import the correct types
import { supabase } from '@/integrations/supabase/client';
import { IOutfitRepository } from '../domain/interfaces/IOutfitRepository';
import { Outfit, OutfitItem, OutfitComment, OutfitStatus, OutfitCategory, OutfitSeason } from '../domain/types';

export class OutfitRepository implements IOutfitRepository {
  async createOutfit(outfitData: Partial<Outfit>): Promise<Outfit> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .insert([
          {
            user_id: outfitData.user_id,
            name: outfitData.name,
            description: outfitData.description,
            top_id: outfitData.top_id,
            bottom_id: outfitData.bottom_id,
            shoes_id: outfitData.shoes_id,
            status: outfitData.status,
            category: outfitData.category,
            season: outfitData.season,
            is_favorite: outfitData.is_favorite,
            likes_count: 0,
            comments_count: 0,
            image_url: outfitData.image_url,
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

  async getOutfitById(id: string): Promise<Outfit | null> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select(`
          *,
          profiles (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error(`Error fetching outfit by ID ${id}:`, error);
        return null;
      }

      return data as Outfit;
    } catch (error) {
      console.error(`Error fetching outfit by ID ${id}:`, error);
      return null;
    }
  }

  async getUserOutfits(userId: string): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select(`
          *,
          profiles (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('user_id', userId);

      if (error) {
        console.error(`Error fetching outfits for user ${userId}:`, error);
        return [];
      }

      return data as Outfit[];
    } catch (error) {
      console.error(`Error fetching outfits for user ${userId}:`, error);
      return [];
    }
  }

  public async updateOutfit(id: string, outfitData: Partial<Outfit>): Promise<Outfit> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .update({
          ...outfitData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Outfit;
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

      if (error) {
        console.error(`Error deleting outfit ${id}:`, error);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Error deleting outfit ${id}:`, error);
      return false;
    }
  }

  async likeOutfit(outfitId: string, userId: string): Promise<boolean> {
    try {
      const { data: existingLike, error: selectError } = await supabase
        .from('outfit_likes')
        .select('*')
        .eq('outfit_id', outfitId)
        .eq('user_id', userId)
        .single();

      if (selectError && selectError.message !== 'No rows found') {
        console.error('Error checking existing like:', selectError);
        return false;
      }

      if (existingLike) {
        console.log('Outfit already liked by user.');
        return true;
      }

      const { error: insertError } = await supabase
        .from('outfit_likes')
        .insert([{ outfit_id: outfitId, user_id: userId }]);

      if (insertError) {
        console.error('Error liking outfit:', insertError);
        return false;
      }

      await this.incrementLikes(outfitId);
      return true;
    } catch (error) {
      console.error('Error liking outfit:', error);
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

      if (error) {
        console.error('Error unliking outfit:', error);
        return false;
      }

      await this.decrementLikes(outfitId);
      return true;
    } catch (error) {
      console.error('Error unliking outfit:', error);
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

      if (error && error.message !== 'No rows found') {
        console.error('Error checking if user liked outfit:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking if user liked outfit:', error);
      return false;
    }
  }

  public async incrementLikes(outfitId: string): Promise<boolean> {
    try {
      // Use rpc for incrementing likes
      const { error } = await supabase.rpc('increment_outfit_likes', { outfit_id: outfitId });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error incrementing likes for outfit ${outfitId}:`, error);
      return false;
    }
  }

  public async decrementLikes(outfitId: string): Promise<boolean> {
    try {
      // Use rpc for decrementing likes
      const { error } = await supabase.rpc('decrement_outfit_likes', { outfit_id: outfitId });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error decrementing likes for outfit ${outfitId}:`, error);
      return false;
    }
  }

  public async addOutfitItem(outfitItem: OutfitItem): Promise<OutfitItem> {
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
      console.error(`Error adding item to outfit ${outfitItem.outfit_id}:`, error);
      throw error;
    }
  }

  public async removeOutfitItem(itemId: string): Promise<boolean> {
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
        .eq('outfit_id', outfitId)
        .order('position');

      if (error) {
        console.error(`Error fetching outfit items for outfit ${outfitId}:`, error);
        return [];
      }

      return data as OutfitItem[];
    } catch (error) {
      console.error(`Error fetching outfit items for outfit ${outfitId}:`, error);
      return [];
    }
  }

  async getFeaturedOutfits(): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select(`
          *,
          profiles (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('status', 'public')
        .order('likes_count', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching featured outfits:', error);
        return [];
      }

      return data as Outfit[];
    } catch (error) {
      console.error('Error fetching featured outfits:', error);
      return [];
    }
  }

  public async getTrendingOutfits(): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select(`
          *,
          profiles (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('status', 'public')
        .order('likes_count', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as Outfit[];
    } catch (error) {
      console.error('Error fetching trending outfits:', error);
      return [];
    }
  }

  public async getSimilarOutfits(outfitId: string): Promise<Outfit[]> {
    try {
      const outfit = await this.getOutfitById(outfitId);
      if (!outfit) throw new Error('Outfit not found');
      
      const { data, error } = await supabase
        .from('outfits')
        .select(`
          *,
          profiles (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('category', outfit.category)
        .eq('status', 'public')
        .neq('id', outfitId)
        .limit(6);
      
      if (error) throw error;
      return data as Outfit[];
    } catch (error) {
      console.error(`Error fetching similar outfits for ${outfitId}:`, error);
      return [];
    }
  }

  async searchOutfits(query: string): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select(`
          *,
          profiles (
            username,
            full_name,
            avatar_url
          )
        `)
        .textSearch('name', query, {
          type: 'websearch',
          config: 'english',
        });

      if (error) {
        console.error(`Error searching outfits with query ${query}:`, error);
        return [];
      }

      return data as Outfit[];
    } catch (error) {
      console.error(`Error searching outfits with query ${query}:`, error);
      return [];
    }
  }

  async getAllOutfits(): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select(`
          *,
          profiles (
            username,
            full_name,
            avatar_url
          )
        `);

      if (error) {
        console.error('Error fetching all outfits:', error);
        return [];
      }

      return data as Outfit[];
    } catch (error) {
      console.error('Error fetching all outfits:', error);
      return [];
    }
  }

  async getOutfitsByUserId(userId: string): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select(`
          *,
          profiles (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('user_id', userId);

      if (error) {
        console.error(`Error fetching outfits for user ID ${userId}:`, error);
        return [];
      }

      return data as Outfit[];
    } catch (error) {
      console.error(`Error fetching outfits for user ID ${userId}:`, error);
      return [];
    }
  }

  async getPublicOutfits(): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select(`
          *,
          profiles (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('status', 'public');

      if (error) {
        console.error('Error fetching public outfits:', error);
        return [];
      }

      return data as Outfit[];
    } catch (error) {
      console.error('Error fetching public outfits:', error);
      return [];
    }
  }

  async addOutfitComment(outfitId: string, userId: string, content: string): Promise<OutfitComment | null> {
    try {
      const { data, error } = await supabase
        .from('outfit_comments')
        .insert([
          {
            outfit_id: outfitId,
            user_id: userId,
            content: content,
          },
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

      if (error) {
        console.error('Error adding outfit comment:', error);
        return null;
      }

      return data as OutfitComment;
    } catch (error) {
      console.error('Error adding outfit comment:', error);
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
        .eq('outfit_id', outfitId);

      if (error) {
        console.error(`Error fetching comments for outfit ${outfitId}:`, error);
        return [];
      }

      return data as OutfitComment[];
    } catch (error) {
      console.error(`Error fetching comments for outfit ${outfitId}:`, error);
      return [];
    }
  }
}
