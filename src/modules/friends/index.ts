
/**
 * Module d'amis - Point d'entrée unique
 * Exporte tous les composants, hooks et utilitaires liés aux amis
 */

// Composants principaux
export { AddFriend } from '@/components/friends/AddFriend';
export { FindFriendsTabs } from '@/components/friends/FindFriendsTabs';
export { FriendCard } from '@/components/friends/FriendCard';
export { FriendsList } from '@/components/friends/FriendsList';
export { PendingFriendRequestsList } from '@/components/friends/PendingFriendRequestsList';
export { SearchFriends } from '@/components/friends/SearchFriends';
export { SuggestedFriendsList } from '@/components/friends/SuggestedFriendsList';
export { SuggestedUserCard } from '@/components/friends/SuggestedUserCard';

// Hooks
export { useFriends } from '@/hooks/useFriends';
export { useSuggestedFriends } from '@/hooks/useSuggestedFriends';
