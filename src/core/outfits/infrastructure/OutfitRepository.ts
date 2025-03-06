
import { supabase } from '@/integrations/supabase/client';
import { Outfit, OutfitComment, OutfitItem, OutfitStatus } from '../domain/types';
import { IOutfitRepository } from '../domain/interfaces/IOutfitRepository';

export class OutfitRepository implements IOutfitRepository {
  // Opérations pour les tenues
  async getOutfitById(id: string): Promise<Outfit | null> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select(`
          *,
          profiles:user_id (username, full_name, avatar_url),
          items:outfit_items (
            id, outfit_id, clothes_id, position, created_at,
            clothes:clothes_id (id, name, image_url, category)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
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
        .select(`
          *,
          profiles:user_id (username, full_name, avatar_url),
          items:outfit_items (
            id, outfit_id, clothes_id, position, created_at,
            clothes:clothes_id (id, name, image_url, category)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Outfit[];
    } catch (error) {
      console.error('Error fetching user outfits:', error);
      return [];
    }
  }

  async getPublicOutfits(limit: number = 10): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select(`
          *,
          profiles:user_id (username, full_name, avatar_url)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(limit);

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
        .select(`
          *,
          profiles:user_id (username, full_name, avatar_url)
        `)
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

  async searchOutfits(query: string): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select(`
          *,
          profiles:user_id (username, full_name, avatar_url)
        `)
        .eq('status', 'published')
        .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Outfit[];
    } catch (error) {
      console.error('Error searching outfits:', error);
      return [];
    }
  }

  async createOutfit(outfit: Partial<Outfit>): Promise<Outfit> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .insert({
          ...outfit,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data as Outfit;
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
          ...outfitData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Outfit;
    } catch (error) {
      console.error('Error updating outfit:', error);
      throw error;
    }
  }

  async updateOutfitStatus(id: string, status: OutfitStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('outfits')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating outfit status:', error);
      return false;
    }
  }

  async deleteOutfit(id: string): Promise<boolean> {
    try {
      // Supprimer d'abord les éléments associés
      await supabase.from('outfit_items').delete().eq('outfit_id', id);
      
      // Puis supprimer la tenue
      const { error } = await supabase.from('outfits').delete().eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting outfit:', error);
      return false;
    }
  }

  // Opérations pour les éléments de tenue
  async getOutfitItems(outfitId: string): Promise<OutfitItem[]> {
    try {
      const { data, error } = await supabase
        .from('outfit_items')
        .select(`
          *,
          clothes:clothes_id (id, name, image_url, category)
        `)
        .eq('outfit_id', outfitId)
        .order('position');

      if (error) throw error;
      return data as OutfitItem[];
    } catch (error) {
      console.error('Error fetching outfit items:', error);
      return [];
    }
  }

  async addOutfitItem(item: Partial<OutfitItem>): Promise<OutfitItem> {
    try {
      const { data, error } = await supabase
        .from('outfit_items')
        .insert({
          ...item,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data as OutfitItem;
    } catch (error) {
      console.error('Error adding outfit item:', error);
      throw error;
    }
  }

  async updateOutfitItem(id: string, itemData: Partial<OutfitItem>): Promise<OutfitItem> {
    try {
      const { data, error } = await supabase
        .from('outfit_items')
        .update(itemData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as OutfitItem;
    } catch (error) {
      console.error('Error updating outfit item:', error);
      throw error;
    }
  }

  async removeOutfitItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('outfit_items').delete().eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing outfit item:', error);
      return false;
    }
  }

  // Interactions sociales
  async getOutfitComments(outfitId: string): Promise<OutfitComment[]> {
    try {
      const { data, error } = await supabase
        .from('outfit_comments')
        .select(`
          *,
          profiles:user_id (username, full_name, avatar_url)
        `)
        .eq('outfit_id', outfitId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as OutfitComment[];
    } catch (error) {
      console.error('Error fetching outfit comments:', error);
      return [];
    }
  }

  async addComment(outfitId: string, userId: string, content: string): Promise<OutfitComment> {
    try {
      const { data, error } = await supabase
        .from('outfit_comments')
        .insert({
          outfit_id: outfitId,
          user_id: userId,
          content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data as OutfitComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  async deleteComment(commentId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('outfit_comments').delete().eq('id', commentId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  }

  async likeOutfit(outfitId: string, userId: string): Promise<boolean> {
    try {
      // Vérifier si l'utilisateur a déjà aimé cette tenue
      const { data: existingLike } = await supabase
        .from('outfit_likes')
        .select('id')
        .eq('outfit_id', outfitId)
        .eq('user_id', userId)
        .single();

      if (existingLike) return true; // Déjà aimé

      // Ajouter le like
      const { error } = await supabase
        .from('outfit_likes')
        .insert({
          outfit_id: outfitId,
          user_id: userId,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      // Mettre à jour le compteur de likes
      await supabase.rpc('increment_outfit_likes', { outfit_id: outfitId });

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

      if (error) throw error;

      // Mettre à jour le compteur de likes
      await supabase.rpc('decrement_outfit_likes', { outfit_id: outfitId });

      return true;
    } catch (error) {
      console.error('Error unliking outfit:', error);
      return false;
    }
  }

  async isOutfitLikedByUser(outfitId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('outfit_likes')
        .select('id')
        .eq('outfit_id', outfitId)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return false; // Pas de résultat trouvé
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking if outfit is liked:', error);
      return false;
    }
  }
}
