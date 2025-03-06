
import { supabase } from '@/integrations/supabase/client';
import { IOutfitRepository } from '../domain/interfaces/IOutfitRepository';
import { Outfit, OutfitItem, OutfitStatus, OutfitComment } from '../domain/types';

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
    return data as Outfit;
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
    // Assurez-vous que les champs requis sont définis
    const defaultOutfit = {
      name: 'Nouvelle tenue',
      status: 'draft' as OutfitStatus,
      category: 'casual' as OutfitCategory,
      season: 'all' as OutfitSeason,
      is_favorite: false,
      likes_count: 0,
      comments_count: 0,
      ...outfit
    };

    const { data, error } = await supabase
      .from('outfits')
      .insert(defaultOutfit)
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
    return data as Outfit[];
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

  // Implémentations des méthodes additionnelles requises par l'interface
  async getOutfitsByUserId(userId: string): Promise<Outfit[]> {
    // Cette méthode est un alias de getUserOutfits pour des raisons de compatibilité
    return this.getUserOutfits(userId);
  }

  async getPublicOutfits(limit: number = 20): Promise<Outfit[]> {
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
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return [];
    return data as Outfit[];
  }

  async getTrendingOutfits(limit: number = 10): Promise<Outfit[]> {
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
      .eq('status', 'published')
      .order('likes_count', { ascending: false })
      .limit(limit);

    if (error) return [];
    return data as Outfit[];
  }

  async searchOutfits(query: string): Promise<Outfit[]> {
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
      .eq('status', 'published')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data as Outfit[];
  }

  async updateOutfitStatus(id: string, status: OutfitStatus): Promise<boolean> {
    const { error } = await supabase
      .from('outfits')
      .update({ status })
      .eq('id', id);

    return !error;
  }

  async getOutfitComments(outfitId: string): Promise<OutfitComment[]> {
    const { data, error } = await supabase
      .from('outfit_comments')
      .select(`
        *,
        profiles:user_id (
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('outfit_id', outfitId)
      .order('created_at', { ascending: true });

    if (error) return [];
    return data as OutfitComment[];
  }

  async addComment(outfitId: string, userId: string, content: string): Promise<OutfitComment> {
    const { data, error } = await supabase
      .from('outfit_comments')
      .insert({
        outfit_id: outfitId,
        user_id: userId,
        content
      })
      .select()
      .single();

    if (error || !data) throw new Error('Erreur lors de l\'ajout du commentaire');
    return data as OutfitComment;
  }

  async deleteComment(commentId: string): Promise<boolean> {
    const { error } = await supabase
      .from('outfit_comments')
      .delete()
      .eq('id', commentId);

    return !error;
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

      // Ajouter un like
      const { error } = await supabase
        .from('outfit_likes')
        .insert({
          outfit_id: outfitId,
          user_id: userId
        });

      if (error) throw error;

      // Appeler la fonction RPC pour incrémenter le compteur de likes
      const { error: rpcError } = await supabase
        .rpc('increment_outfit_likes', { outfit_id: outfitId });

      if (rpcError) throw rpcError;

      return true;
    } catch (error) {
      console.error('Erreur lors du like:', error);
      return false;
    }
  }

  async unlikeOutfit(outfitId: string, userId: string): Promise<boolean> {
    try {
      // Supprimer le like
      const { error } = await supabase
        .from('outfit_likes')
        .delete()
        .eq('outfit_id', outfitId)
        .eq('user_id', userId);

      if (error) throw error;

      // Appeler la fonction RPC pour décrémenter le compteur de likes
      const { error: rpcError } = await supabase
        .rpc('decrement_outfit_likes', { outfit_id: outfitId });

      if (rpcError) throw rpcError;

      return true;
    } catch (error) {
      console.error('Erreur lors du unlike:', error);
      return false;
    }
  }

  async isOutfitLikedByUser(outfitId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('outfit_likes')
      .select('id')
      .eq('outfit_id', outfitId)
      .eq('user_id', userId)
      .single();

    if (error) return false;
    return !!data;
  }
}
