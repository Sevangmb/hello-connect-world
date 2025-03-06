
// Module de gestion des tenues
import { AppModule } from '@/hooks/modules/types';

export const OutfitsModule: AppModule = {
  id: 'outfits-module',
  name: 'Gestion des Tenues',
  code: 'outfits',
  description: 'Module permettant de créer et gérer des tenues à partir de vos vêtements',
  status: 'active',
  is_core: false,
  version: '1.0.0',
  priority: 2,
  features: {
    create_outfit: true,
    share_outfit: true,
    like_outfit: true,
    comment_outfit: true
  }
};

export default OutfitsModule;
