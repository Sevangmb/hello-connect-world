
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '@/types/messages';

export function useMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }
        
        // Attempt to get conversations from the database
        const { data, error } = await supabase.rpc(
          'get_user_conversations' as any, 
          { user_id: user.id }
        );
        
        if (error) throw error;
        
        if (data) {
          // Explicitly cast to Conversation[] to avoid type errors
          setConversations(data as Conversation[]);
        }
        
        // Count unread messages
        const { count, error: countError } = await supabase
          .from('private_messages')
          .select('*', { count: 'exact', head: true })
          .eq('receiver_id', user.id)
          .eq('is_read', false);
          
        if (!countError) {
          setUnreadCount(count || 0);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
    
    // Set up realtime subscription for new messages
    const channel = supabase
      .channel('private_messages_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'private_messages'
      }, () => {
        fetchConversations();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  return {
    conversations,
    loading,
    unreadCount
  };
}
