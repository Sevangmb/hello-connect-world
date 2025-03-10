
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

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
            profiles(username, avatar_url),
            likes:post_likes(count)
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error("Erreur lors du chargement des publications:", err);
        throw err;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    console.error("Erreur de chargement des publications:", error);
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Une erreur est survenue lors du chargement des publications.</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          size="sm"
        >
          Réessayer
        </Button>
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
      {publications.map((post) => (
        <div key={post.id} className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
              {post.profiles?.avatar_url && (
                <img src={post.profiles.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <p className="font-medium">{post.profiles?.username || 'Utilisateur anonyme'}</p>
            </div>
          </div>
          <p className="mb-2">{post.content}</p>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
            <span>{post.likes ? post.likes[0]?.count || 0 : 0} j'aime</span>
          </div>
        </div>
      ))}
    </div>
  );
};
