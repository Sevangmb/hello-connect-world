
import { supabase } from '@/integrations/supabase/client';
import { MenuItem, MenuItemCategory } from '@/services/menu/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Seeds menu items into the database if they don't exist
 */
export const seedMenuItems = async (): Promise<void> => {
  // Check if we already have menu items
  const { count, error: countError } = await supabase
    .from('menu_items')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Error checking menu items count:', countError);
    return;
  }

  // If we have menu items, skip seeding
  if (count && count > 0) {
    console.log(`${count} menu items already exist, skipping seeding`);
    return;
  }

  console.log('No menu items found, seeding default menu items...');

  // Prepare all the menu items we want to seed
  const menuItems: Omit<MenuItem, 'id' | 'children'>[] = [
    // Main menu items
    {
      name: 'Accueil',
      path: '/',
      icon: 'Home',
      category: 'main' as MenuItemCategory,
      parent_id: null,
      order: 1,
      is_visible: true,
      module_code: 'home',
      requires_auth: false,
      requires_admin: false,
      is_active: true,
      position: 1,
      description: 'Page d\'accueil',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    
    // Add more menu items as needed...
  ];

  try {
    // Cast each item to the expected type when inserting
    for (const item of menuItems) {
      const { error } = await supabase
        .from('menu_items')
        .insert({
          id: uuidv4(),
          name: item.name,
          path: item.path,
          icon: item.icon,
          category: item.category,
          parent_id: item.parent_id,
          order: item.order,
          is_visible: item.is_visible,
          module_code: item.module_code,
          requires_auth: item.requires_auth,
          requires_admin: item.requires_admin,
          is_active: item.is_active,
          position: item.position,
          description: item.description,
          created_at: item.created_at,
          updated_at: item.updated_at,
        });
      
      if (error) {
        console.error(`Error inserting menu item ${item.name}:`, error);
      }
    }
    
    console.log(`Successfully seeded ${menuItems.length} menu items`);
  } catch (error) {
    console.error('Error seeding menu items:', error);
  }
};
