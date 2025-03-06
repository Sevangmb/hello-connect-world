
import { supabase } from '@/integrations/supabase/client';
import { Outfit, OutfitComment, OutfitItem, OutfitStatus, DbOutfit } from '../domain/types';
import { IOutfitRepository } from '../domain/interfaces/IOutfitRepository';

export class OutfitRepository implements IOutfitRepository {
  // Opérations pour les tenues
  async getOutfitById(id: string): Promise<Outfit | null> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select(`
          *,
          profiles:user_id (username, full_name, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Conversion explicite pour assurer la compatibilité des types
      const outfitData = data as DbOutfit;
      
      // Création de l'objet Outfit avec les valeurs par défaut si nécessaire
      const outfit: Outfit = {
        id: outfitData.id,
        user_id: outfitData.user_id,
        name: outfitData.name,
        description: outfitData.description || '',
        status: (outfitData.status as OutfitStatus) || 'published',
        category: (outfitData.category as any) || 'casual',
        season: (outfitData.season as any) || 'all',
        is_favorite: outfitData.is_favorite || false,
        likes_count: outfitData.likes_count || 0,
        comments_count: outfitData.comments_count || 0,
        created_at: outfitData.created_at,
        updated_at: outfitData.updated_at,
        top_id: outfitData.top_id,
        bottom_id: outfitData.bottom_id,
        shoes_id: outfitData.shoes_id,
        profiles: outfitData.profiles
      };
      
      return outfit;
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
          profiles:user_id (username, full_name, avatar_url)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map les données brutes vers le type Outfit
      return (data as DbOutfit[]).map(item => ({
        id: item.id,
        user_id: item.user_id,
        name: item.name,
        description: item.description || '',
        status: (item.status as OutfitStatus) || 'published',
        category: (item.category as any) || 'casual',
        season: (item.season as any) || 'all',
        is_favorite: item.is_favorite || false,
        likes_count: item.likes_count || 0,
        comments_count: item.comments_count || 0,
        created_at: item.created_at,
        updated_at: item.updated_at,
        top_id: item.top_id,
        bottom_id: item.bottom_id,
        shoes_id: item.shoes_id,
        profiles: item.profiles
      }));
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
      
      return (data as DbOutfit[]).map(item => ({
        id: item.id,
        user_id: item.user_id,
        name: item.name,
        description: item.description || '',
        status: (item.status as OutfitStatus) || 'published',
        category: (item.category as any) || 'casual',
        season: (item.season as any) || 'all',
        is_favorite: item.is_favorite || false,
        likes_count: item.likes_count || 0,
        comments_count: item.comments_count || 0,
        created_at: item.created_at,
        updated_at: item.updated_at,
        top_id: item.top_id,
        bottom_id: item.bottom_id,
        shoes_id: item.shoes_id,
        profiles: item.profiles
      }));
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
      
      return (data as DbOutfit[]).map(item => ({
        id: item.id,
        user_id: item.user_id,
        name: item.name,
        description: item.description || '',
        status: (item.status as OutfitStatus) || 'published',
        category: (item.category as any) || 'casual',
        season: (item.season as any) || 'all',
        is_favorite: item.is_favorite || false,
        likes_count: item.likes_count || 0,
        comments_count: item.comments_count || 0,
        created_at: item.created_at,
        updated_at: item.updated_at,
        top_id: item.top_id,
        bottom_id: item.bottom_id,
        shoes_id: item.shoes_id,
        profiles: item.profiles
      }));
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
      
      return (data as DbOutfit[]).map(item => ({
        id: item.id,
        user_id: item.user_id,
        name: item.name,
        description: item.description || '',
        status: (item.status as OutfitStatus) || 'published',
        category: (item.category as any) || 'casual',
        season: (item.season as any) || 'all',
        is_favorite: item.is_favorite || false,
        likes_count: item.likes_count || 0,
        comments_count: item.comments_count || 0,
        created_at: item.created_at,
        updated_at: item.updated_at,
        top_id: item.top_id,
        bottom_id: item.bottom_id,
        shoes_id: item.shoes_id,
        profiles: item.profiles
      }));
    } catch (error) {
      console.error('Error searching outfits:', error);
      return [];
    }
  }

  async createOutfit(outfit: Partial<Outfit>): Promise<Outfit> {
    try {
      // S'assurer que les valeurs requises sont présentes
      const outfitToCreate = {
        user_id: outfit.user_id,
        name: outfit.name || 'Nouvelle tenue',
        description: outfit.description || '',
        status: outfit.status || 'published',
        category: outfit.category || 'casual',
        season: outfit.season || 'all',
        is_favorite: outfit.is_favorite || false,
        likes_count: outfit.likes_count || 0,
        comments_count: outfit.comments_count || 0,
        top_id: outfit.top_id,
        bottom_id: outfit.bottom_id,
        shoes_id: outfit.shoes_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('outfits')
        .insert(outfitToCreate)
        .select()
        .single();

      if (error) throw error;
      
      // Conversion sûre des données
      const createdOutfit = data as DbOutfit;
      
      return {
        id: createdOutfit.id,
        user_id: createdOutfit.user_id,
        name: createdOutfit.name,
        description: createdOutfit.description || '',
        status: (createdOutfit.status as OutfitStatus) || 'published',
        category: (createdOutfit.category as any) || 'casual',
        season: (createdOutfit.season as any) || 'all',
        is_favorite: createdOutfit.is_favorite || false,
        likes_count: createdOutfit.likes_count || 0,
        comments_count: createdOutfit.comments_count || 0,
        created_at: createdOutfit.created_at,
        updated_at: createdOutfit.updated_at,
        top_id: createdOutfit.top_id,
        bottom_id: createdOutfit.bottom_id,
        shoes_id: createdOutfit.shoes_id
      };
    } catch (error) {
      console.error('Error creating outfit:', error);
      throw error;
    }
  }

  async updateOutfit(id: string, outfitData: Partial<Outfit>): Promise<Outfit> {
    try {
      // Préparer les données pour la mise à jour
      const updateData = {
        ...outfitData,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('outfits')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const updatedOutfit = data as DbOutfit;
      
      return {
        id: updatedOutfit.id,
        user_id: updatedOutfit.user_id,
        name: updatedOutfit.name,
        description: updatedOutfit.description || '',
        status: (updatedOutfit.status as OutfitStatus) || 'published',
        category: (updatedOutfit.category as any) || 'casual',
        season: (updatedOutfit.season as any) || 'all',
        is_favorite: updatedOutfit.is_favorite || false,
        likes_count: updatedOutfit.likes_count || 0,
        comments_count: updatedOutfit.comments_count || 0,
        created_at: updatedOutfit.created_at,
        updated_at: updatedOutfit.updated_at,
        top_id: updatedOutfit.top_id,
        bottom_id: updatedOutfit.bottom_id,
        shoes_id: updatedOutfit.shoes_id
      };
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

      if (error) {
        console.error('Error in getOutfitItems:', error);
        return [];
      }

      // Si aucune donnée n'est retournée, retourner un tableau vide
      if (!data || data.length === 0) {
        return [];
      }

      return data as OutfitItem[];
    } catch (error) {
      console.error('Error fetching outfit items:', error);
      return [];
    }
  }

  async addOutfitItem(item: Partial<OutfitItem>): Promise<OutfitItem> {
    try {
      // Get current max position for this outfit
      const { data: existingItems } = await supabase
        .from('outfit_items')
        .select('position')
        .eq('outfit_id', item.outfit_id)
        .order('position', { ascending: false })
        .limit(1);
      
      const nextPosition = existingItems && existingItems.length > 0 
        ? existingItems[0].position + 1 
        : 0;
        
      const newItem = {
        outfit_id: item.outfit_id,
        clothes_id: item.clothes_id,
        position: item.position !== undefined ? item.position : nextPosition,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('outfit_items')
        .insert(newItem)
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

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking if outfit is liked:', error);
      return false;
    }
  }
}
