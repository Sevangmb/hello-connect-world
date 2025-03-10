
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const PublicationsSection = () => {
  const { data: publications, isLoading, error } = useQuery({
    queryKey: ['explore-publications'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            id,
            content,
            created_at,
            profiles(username, avatar_url)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        
        return data || [];
      } catch (err) {
        console.error("Erreur lors du chargement des publications:", err);
        throw err;
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    console.error("Erreur publications:", error);
    return (
      <div className="text-center py-8 text-red-500">
        <p>Une erreur est survenue lors du chargement des publications.</p>
      </div>
    );
  }

  if (!publications || publications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="mb-2">Aucune publication disponible pour le moment.</p>
        <p className="text-sm">Les publications de votre réseau apparaîtront ici.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {publications.map((publication) => (
        <div key={publication.id} className="p-4 border rounded-lg bg-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {publication.profiles?.avatar_url ? (
                <img 
                  src={publication.profiles.avatar_url} 
                  alt={publication.profiles.username || 'Avatar'} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-gray-600 text-sm">{publication.profiles?.username?.charAt(0).toUpperCase() || '?'}</span>
              )}
            </div>
            <div>
              <p className="font-medium">{publication.profiles?.username || 'Utilisateur inconnu'}</p>
              <p className="text-xs text-gray-500">
                {new Date(publication.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
          <p className="text-sm">{publication.content}</p>
        </div>
      ))}
    </div>
  );
}
