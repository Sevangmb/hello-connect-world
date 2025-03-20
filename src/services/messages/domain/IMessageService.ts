
import { PrivateMessage } from '@/types/messages';
import { UserConversation } from '../types/messageTypes';

/**
 * Interface définissant les capacités du service de messages
 */
export interface IMessageService {
  /**
   * Récupère les messages entre l'utilisateur actuel et un partenaire
   */
  fetchMessages(partnerId: string): Promise<PrivateMessage[]>;
  
  /**
   * Envoie un message à un destinataire
   */
  sendMessage(receiverId: string, content: string): Promise<PrivateMessage>;
  
  /**
   * Récupère toutes les conversations pour l'utilisateur actuel
   */
  fetchConversations(): Promise<UserConversation[]>;
  
  /**
   * Marque les messages d'un expéditeur comme lus
   */
  markMessagesAsRead(senderId: string): Promise<void>;
  
  /**
   * Compte les messages non lus pour l'utilisateur actuel
   */
  countUnreadMessages(): Promise<number>;
  
  /**
   * Vérifie le statut en ligne d'un utilisateur
   */
  checkUserOnlineStatus(userId: string): Promise<boolean>;
  
  /**
   * Met à jour la liste des utilisateurs en ligne (pour la démo)
   */
  updateOnlineUsers(userIds: string[]): Promise<Record<string, boolean>>;
}
