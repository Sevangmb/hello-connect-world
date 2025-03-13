
/**
 * Module de messages - Point d'entrée unique
 * Exporte tous les composants, hooks et utilitaires liés aux messages
 */

// Composants
import { GroupChat } from '@/components/messages/GroupChat';
import { MessagesList } from '@/components/messages/MessagesList';
import { PrivateChat } from '@/components/messages/PrivateChat';
import { MessageItem } from '@/components/messages/MessageItem';

// Services
import { messagesService } from '@/services/messages/messagesService';

// Hooks
import { useMessages } from '@/hooks/useMessages';

// Exports des composants
export { GroupChat };
export { MessagesList };
export { PrivateChat };
export { MessageItem };

// Export du service
export { messagesService };

// Export du hook
export { useMessages };
