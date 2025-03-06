
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Outfit, OutfitItem, OutfitStatus, OutfitCategory, OutfitSeason } from '@/core/outfits/domain/types';
import { useToast } from '@/hooks/use-toast';

export const useOutfits = () => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [currentOutfit, setCurrentOutfit] = useState<Outfit | null>(null);
  const [outfitItems, setOutfitItems] = useState<OutfitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Récupérer toutes les tenues de l'utilisateur actuel
  const fetchUserOutfits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Utilisateur non authentifié");
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('outfits')
        .select(`
          *,
          profiles:user_id (username, full_name, avatar_url)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Convertir les données en objets typés
      const mappedOutfits: Outfit[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        name: item.name,
        description: item.description || '',
        status: (item.status as OutfitStatus) || 'published',
        category: (item.category as OutfitCategory) || 'casual',
        season: (item.season as OutfitSeason) || 'all',
        is_favorite: !!item.is_favorite,
        likes_count: item.likes_count || 0,
        comments_count: item.comments_count || 0,
        created_at: item.created_at,
        updated_at: item.updated_at,
        top_id: item.top_id,
        bottom_id: item.bottom_id,
        shoes_id: item.shoes_id,
        profiles: item.profiles
      }));
      
      setOutfits(mappedOutfits);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger vos tenues",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  // Créer une nouvelle tenue
  const createOutfit = useCallback(async (outfitData: Partial<Outfit>) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Utilisateur non authentifié");
      }
      
      const newOutfit = {
        user_id: user.id,
        name: outfitData.name || 'Nouvelle tenue',
        description: outfitData.description || '',
        status: outfitData.status || 'published', 
        category: outfitData.category || 'casual',
        season: outfitData.season || 'all',
        is_favorite: outfitData.is_favorite || false,
        likes_count: 0,
        comments_count: 0,
        top_id: outfitData.top_id,
        bottom_id: outfitData.bottom_id,
        shoes_id: outfitData.shoes_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('outfits')
        .insert(newOutfit)
        .select()
        .single();
      
      if (error) throw error;
      
      const createdOutfit: Outfit = {
        id: data.id,
        user_id: data.user_id,
        name: data.name,
        description: data.description || '',
        status: (data.status as OutfitStatus) || 'published',
        category: (data.category as OutfitCategory) || 'casual',
        season: (data.season as OutfitSeason) || 'all',
        is_favorite: !!data.is_favorite,
        likes_count: data.likes_count || 0,
        comments_count: data.comments_count || 0,
        created_at: data.created_at,
        updated_at: data.updated_at,
        top_id: data.top_id,
        bottom_id: data.bottom_id,
        shoes_id: data.shoes_id
      };
      
      setOutfits(prev => [createdOutfit, ...prev]);
      
      toast({
        title: "Tenue créée",
        description: "Votre nouvelle tenue a été créée avec succès",
      });
      
      return createdOutfit;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la tenue",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  // Récupérer les détails d'une tenue
  const fetchOutfitDetails = useCallback(async (outfitId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('outfits')
        .select(`
          *,
          profiles:user_id(username, full_name, avatar_url)
        `)
        .eq('id', outfitId)
        .single();
      
      if (error) throw error;
      
      // Convertir les données en objet typé
      const mappedOutfit: Outfit = {
        id: data.id,
        user_id: data.user_id,
        name: data.name,
        description: data.description || '',
        status: (data.status as OutfitStatus) || 'published',
        category: (data.category as OutfitCategory) || 'casual',
        season: (data.season as OutfitSeason) || 'all',
        is_favorite: !!data.is_favorite,
        likes_count: data.likes_count || 0,
        comments_count: data.comments_count || 0,
        created_at: data.created_at,
        updated_at: data.updated_at,
        top_id: data.top_id,
        bottom_id: data.bottom_id,
        shoes_id: data.shoes_id,
        profiles: data.profiles
      };
      
      setCurrentOutfit(mappedOutfit);
      
      // Récupérer les éléments de la tenue
      try {
        const { data: itemsData, error: itemsError } = await supabase
          .from('outfit_items')
          .select(`
            *,
            clothes:clothes_id (id, name, image_url, category)
          `)
          .eq('outfit_id', outfitId)
          .order('position');

        if (itemsError) throw itemsError;
        
        setOutfitItems(itemsData || []);
      } catch (itemsErr) {
        console.error('Error fetching outfit items:', itemsErr);
        setOutfitItems([]);
      }
      
      return mappedOutfit;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les détails de la tenue",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  // Mettre à jour une tenue
  const updateOutfit = useCallback(async (outfitId: string, outfitData: Partial<Outfit>) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('outfits')
        .update({
          ...outfitData,
          updated_at: new Date().toISOString()
        })
        .eq('id', outfitId)
        .select()
        .single();
      
      if (error) throw error;
      
      const updatedOutfit: Outfit = {
        ...currentOutfit!,
        ...outfitData,
        updated_at: data.updated_at
      };
      
      setCurrentOutfit(updatedOutfit);
      setOutfits(prev => prev.map(o => o.id === outfitId ? updatedOutfit : o));
      
      toast({
        title: "Tenue mise à jour",
        description: "Votre tenue a été mise à jour avec succès",
      });
      
      return updatedOutfit;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la tenue",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentOutfit, toast]);
  
  // Ajouter un vêtement à la tenue
  const addOutfitItem = useCallback(async (outfitId: string, clothesId: string, position: number = 0) => {
    try {
      setLoading(true);
      
      const newItem = {
        outfit_id: outfitId,
        clothes_id: clothesId,
        position,
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('outfit_items')
        .insert(newItem)
        .select()
        .single();
      
      if (error) throw error;
      
      // Récupérer les informations sur le vêtement
      const { data: clothesData, error: clothesError } = await supabase
        .from('clothes')
        .select('id, name, image_url, category')
        .eq('id', clothesId)
        .single();
      
      if (clothesError) {
        console.error('Error fetching clothes details:', clothesError);
      }
      
      const newOutfitItem: OutfitItem = {
        ...data,
        clothes: clothesData || undefined
      };
      
      // Mettre à jour l'état
      setOutfitItems(prev => [...prev, newOutfitItem]);
      
      toast({
        title: "Élément ajouté",
        description: "Le vêtement a été ajouté à la tenue",
      });
      
      return newOutfitItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le vêtement à la tenue",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  // Retirer un vêtement de la tenue
  const removeOutfitItem = useCallback(async (itemId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('outfit_items')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
      
      // Mettre à jour l'état
      setOutfitItems(prev => prev.filter(item => item.id !== itemId));
      
      toast({
        title: "Élément retiré",
        description: "Le vêtement a été retiré de la tenue",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de retirer le vêtement de la tenue",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  // Liker/unliker une tenue
  const toggleLikeOutfit = useCallback(async (outfitId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Utilisateur non authentifié");
      }
      
      // Vérifier si l'utilisateur a déjà liké la tenue
      const { data: likeData, error: likeError } = await supabase
        .from('outfit_likes')
        .select('id')
        .eq('outfit_id', outfitId)
        .eq('user_id', user.id)
        .single();
      
      if (likeError && likeError.code !== 'PGRST116') {
        throw likeError;
      }
      
      if (likeData) {
        // L'utilisateur a déjà liké, donc on unlike
        const { error } = await supabase
          .from('outfit_likes')
          .delete()
          .eq('id', likeData.id);
        
        if (error) throw error;
        
        // Mettre à jour le compteur de likes
        await supabase.rpc('decrement_outfit_likes', { outfit_id: outfitId });
        
        // Mettre à jour l'état
        if (currentOutfit && currentOutfit.id === outfitId) {
          setCurrentOutfit({
            ...currentOutfit,
            likes_count: Math.max(0, currentOutfit.likes_count - 1)
          });
        }
        
        setOutfits(prev => prev.map(o => {
          if (o.id === outfitId) {
            return { ...o, likes_count: Math.max(0, o.likes_count - 1) };
          }
          return o;
        }));
        
        return false; // N'est plus liké
      } else {
        // L'utilisateur n'a pas encore liké, donc on like
        const { error } = await supabase
          .from('outfit_likes')
          .insert({
            outfit_id: outfitId,
            user_id: user.id,
            created_at: new Date().toISOString()
          });
        
        if (error) throw error;
        
        // Mettre à jour le compteur de likes
        await supabase.rpc('increment_outfit_likes', { outfit_id: outfitId });
        
        // Mettre à jour l'état
        if (currentOutfit && currentOutfit.id === outfitId) {
          setCurrentOutfit({
            ...currentOutfit,
            likes_count: currentOutfit.likes_count + 1
          });
        }
        
        setOutfits(prev => prev.map(o => {
          if (o.id === outfitId) {
            return { ...o, likes_count: o.likes_count + 1 };
          }
          return o;
        }));
        
        return true; // Est maintenant liké
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de gérer le like",
      });
      throw err;
    }
  }, [currentOutfit, toast]);
  
  // Charger les tenues au montage du composant
  useEffect(() => {
    fetchUserOutfits();
  }, [fetchUserOutfits]);
  
  return {
    outfits,
    currentOutfit,
    outfitItems,
    loading,
    error,
    fetchUserOutfits,
    createOutfit,
    fetchOutfitDetails,
    updateOutfit,
    addOutfitItem,
    removeOutfitItem,
    toggleLikeOutfit
  };
};
