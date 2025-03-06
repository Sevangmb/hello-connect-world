
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { Outfit, OutfitComment, OutfitItem } from '@/core/outfits/domain/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useOutfits() {
  const { user } = useAuth();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [currentOutfit, setCurrentOutfit] = useState<Outfit | null>(null);
  const [outfitItems, setOutfitItems] = useState<OutfitItem[]>([]);
  const [comments, setComments] = useState<OutfitComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les tenues de l'utilisateur
  const loadUserOutfits = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setOutfits(data || []);
    } catch (err: any) {
      console.error('Error loading outfits:', err);
      setError(err.message);
      toast.error('Erreur lors du chargement des tenues');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Créer une nouvelle tenue
  const createOutfit = useCallback(async (outfitData: Partial<Outfit>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('outfits')
        .insert({
          ...outfitData,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setOutfits(prev => [data, ...prev]);
      toast.success('Tenue créée avec succès');
      return data;
    } catch (err: any) {
      console.error('Error creating outfit:', err);
      setError(err.message);
      toast.error('Erreur lors de la création de la tenue');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Charger les détails d'une tenue
  const loadOutfitDetails = useCallback(async (outfitId: string) => {
    try {
      setLoading(true);
      setError(null);
      
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
        .eq('id', outfitId)
        .single();
        
      if (error) throw error;
      
      setCurrentOutfit(data);
      setOutfitItems(data.items || []);
      
      // Charger les commentaires
      await loadOutfitComments(outfitId);
      
      return data;
    } catch (err: any) {
      console.error('Error loading outfit details:', err);
      setError(err.message);
      toast.error('Erreur lors du chargement des détails de la tenue');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour une tenue
  const updateOutfit = useCallback(async (outfitId: string, outfitData: Partial<Outfit>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('outfits')
        .update({
          ...outfitData,
          updated_at: new Date().toISOString()
        })
        .eq('id', outfitId)
        .eq('user_id', user.id) // Sécurité: seul le propriétaire peut modifier
        .select()
        .single();
        
      if (error) throw error;
      
      // Mettre à jour les états locaux
      setOutfits(prev => prev.map(outfit => 
        outfit.id === outfitId ? { ...outfit, ...data } : outfit
      ));
      
      if (currentOutfit?.id === outfitId) {
        setCurrentOutfit(prev => prev ? { ...prev, ...data } : null);
      }
      
      toast.success('Tenue mise à jour avec succès');
      return data;
    } catch (err: any) {
      console.error('Error updating outfit:', err);
      setError(err.message);
      toast.error('Erreur lors de la mise à jour de la tenue');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, currentOutfit]);

  // Supprimer une tenue
  const deleteOutfit = useCallback(async (outfitId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      setLoading(true);
      setError(null);
      
      // Supprimer les éléments associés
      await supabase.from('outfit_items').delete().eq('outfit_id', outfitId);
      
      // Supprimer la tenue
      const { error } = await supabase
        .from('outfits')
        .delete()
        .eq('id', outfitId)
        .eq('user_id', user.id); // Sécurité: seul le propriétaire peut supprimer
        
      if (error) throw error;
      
      // Mettre à jour les états locaux
      setOutfits(prev => prev.filter(outfit => outfit.id !== outfitId));
      
      if (currentOutfit?.id === outfitId) {
        setCurrentOutfit(null);
        setOutfitItems([]);
      }
      
      toast.success('Tenue supprimée avec succès');
      return true;
    } catch (err: any) {
      console.error('Error deleting outfit:', err);
      setError(err.message);
      toast.error('Erreur lors de la suppression de la tenue');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, currentOutfit]);

  // Ajouter un vêtement à une tenue
  const addClothesToOutfit = useCallback(async (outfitId: string, clothesId: string, position: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('outfit_items')
        .insert({
          outfit_id: outfitId,
          clothes_id: clothesId,
          position,
          created_at: new Date().toISOString()
        })
        .select(`
          *,
          clothes:clothes_id (id, name, image_url, category)
        `)
        .single();
        
      if (error) throw error;
      
      // Mettre à jour l'état local
      setOutfitItems(prev => [...prev, data]);
      
      toast.success('Vêtement ajouté à la tenue');
      return data;
    } catch (err: any) {
      console.error('Error adding clothes to outfit:', err);
      setError(err.message);
      toast.error('Erreur lors de l\'ajout du vêtement à la tenue');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Retirer un vêtement d'une tenue
  const removeClothesFromOutfit = useCallback(async (itemId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('outfit_items')
        .delete()
        .eq('id', itemId);
        
      if (error) throw error;
      
      // Mettre à jour l'état local
      setOutfitItems(prev => prev.filter(item => item.id !== itemId));
      
      toast.success('Vêtement retiré de la tenue');
      return true;
    } catch (err: any) {
      console.error('Error removing clothes from outfit:', err);
      setError(err.message);
      toast.error('Erreur lors du retrait du vêtement de la tenue');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les commentaires d'une tenue
  const loadOutfitComments = useCallback(async (outfitId: string) => {
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
      
      setComments(data || []);
      return data;
    } catch (err: any) {
      console.error('Error loading outfit comments:', err);
      setError(err.message);
      return [];
    }
  }, []);

  // Ajouter un commentaire
  const addComment = useCallback(async (outfitId: string, content: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('outfit_comments')
        .insert({
          outfit_id: outfitId,
          user_id: user.id,
          content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select(`
          *,
          profiles:user_id (username, full_name, avatar_url)
        `)
        .single();
        
      if (error) throw error;
      
      // Mettre à jour l'état local
      setComments(prev => [data, ...prev]);
      
      // Mettre à jour le compteur de commentaires
      if (currentOutfit?.id === outfitId) {
        setCurrentOutfit(prev => prev ? { 
          ...prev, 
          comments_count: (prev.comments_count || 0) + 1 
        } : null);
      }
      
      return data;
    } catch (err: any) {
      console.error('Error adding comment:', err);
      setError(err.message);
      toast.error('Erreur lors de l\'ajout du commentaire');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, currentOutfit]);

  // Like/Unlike une tenue
  const toggleLike = useCallback(async (outfitId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      setLoading(true);
      setError(null);
      
      // Vérifier si déjà liké
      const { data: existingLike, error: checkError } = await supabase
        .from('outfit_likes')
        .select('id')
        .eq('outfit_id', outfitId)
        .eq('user_id', user.id)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      
      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('outfit_likes')
          .delete()
          .eq('id', existingLike.id);
          
        if (error) throw error;
        
        // Mettre à jour le compteur de likes
        if (currentOutfit?.id === outfitId) {
          setCurrentOutfit(prev => prev ? { 
            ...prev, 
            likes_count: Math.max((prev.likes_count || 0) - 1, 0)
          } : null);
        }
        
        toast.success('Vous n\'aimez plus cette tenue');
        return false;
      } else {
        // Like
        const { error } = await supabase
          .from('outfit_likes')
          .insert({
            outfit_id: outfitId,
            user_id: user.id,
            created_at: new Date().toISOString()
          });
          
        if (error) throw error;
        
        // Mettre à jour le compteur de likes
        if (currentOutfit?.id === outfitId) {
          setCurrentOutfit(prev => prev ? { 
            ...prev, 
            likes_count: (prev.likes_count || 0) + 1 
          } : null);
        }
        
        toast.success('Vous aimez cette tenue');
        return true;
      }
    } catch (err: any) {
      console.error('Error toggling like:', err);
      setError(err.message);
      toast.error('Erreur lors de l\'action sur le like');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, currentOutfit]);

  // Vérifier si l'utilisateur a liké une tenue
  const checkIfLiked = useCallback(async (outfitId: string) => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('outfit_likes')
        .select('id')
        .eq('outfit_id', outfitId)
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') return false; // Pas de résultat trouvé
        throw error;
      }
      
      return !!data;
    } catch (err: any) {
      console.error('Error checking if outfit is liked:', err);
      return false;
    }
  }, [user]);

  // Charger les tenues tendances/populaires
  const loadTrendingOutfits = useCallback(async (limit: number = 10) => {
    try {
      setLoading(true);
      setError(null);
      
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
      
      return data || [];
    } catch (err: any) {
      console.error('Error loading trending outfits:', err);
      setError(err.message);
      toast.error('Erreur lors du chargement des tenues tendances');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger automatiquement les tenues de l'utilisateur
  useEffect(() => {
    if (user) {
      loadUserOutfits();
    } else {
      setOutfits([]);
      setCurrentOutfit(null);
      setOutfitItems([]);
      setComments([]);
    }
  }, [user, loadUserOutfits]);

  return {
    outfits,
    currentOutfit,
    outfitItems,
    comments,
    loading,
    error,
    loadUserOutfits,
    createOutfit,
    loadOutfitDetails,
    updateOutfit,
    deleteOutfit,
    addClothesToOutfit,
    removeClothesFromOutfit,
    loadOutfitComments,
    addComment,
    toggleLike,
    checkIfLiked,
    loadTrendingOutfits
  };
}
