
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Fonction pour initialiser les modules
export const initializeModules = async (): Promise<void> => {
  try {
    // Vérifier si des modules existent déjà
    const { count, error } = await supabase
      .from('app_modules')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error checking modules:', error);
      return;
    }
    
    // Si des modules existent déjà, ne pas réinsérer
    if (count && count > 0) {
      console.log('Modules already initialized. Skipping.');
      return;
    }
    
    // Définir les modules de base
    const modules = [
      {
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        code: 'core',
        name: 'Core',
        description: 'Module principal contenant les fonctionnalités essentielles',
        status: 'active',
        is_core: true,
        priority: 1
      },
      {
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        code: 'auth',
        name: 'Authentication',
        description: 'Module d\'authentification',
        status: 'active',
        is_core: true,
        priority: 2
      },
      {
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        code: 'profile',
        name: 'Profile',
        description: 'Gestion des profils utilisateurs',
        status: 'active',
        is_core: false,
        priority: 5
      },
      {
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        code: 'clothes',
        name: 'Clothes',
        description: 'Gestion des vêtements',
        status: 'active',
        is_core: false,
        priority: 10
      },
      {
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        code: 'outfits',
        name: 'Outfits',
        description: 'Création et gestion de tenues',
        status: 'active',
        is_core: false,
        priority: 11
      },
      {
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        code: 'suitcases',
        name: 'Suitcases',
        description: 'Gestion des valises de voyage',
        status: 'active',
        is_core: false,
        priority: 12
      },
      {
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        code: 'marketplace',
        name: 'Marketplace',
        description: 'Place de marché et boutiques',
        status: 'active',
        is_core: false,
        priority: 20
      },
      {
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        code: 'social',
        name: 'Social',
        description: 'Fonctionnalités sociales et communautaires',
        status: 'active',
        is_core: false,
        priority: 15
      },
      {
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        code: 'friends',
        name: 'Friends',
        description: 'Gestion des amis',
        status: 'active',
        is_core: false,
        priority: 16
      },
      {
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        code: 'messages',
        name: 'Messages',
        description: 'Messagerie entre utilisateurs',
        status: 'active',
        is_core: false,
        priority: 17
      },
      {
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        code: 'challenges',
        name: 'Challenges',
        description: 'Défis de mode communautaires',
        status: 'active',
        is_core: false,
        priority: 18
      },
      {
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        code: 'notifications',
        name: 'Notifications',
        description: 'Système de notifications',
        status: 'active',
        is_core: false,
        priority: 25
      },
      {
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        code: 'admin',
        name: 'Admin',
        description: 'Panneau d\'administration',
        status: 'active',
        is_core: false,
        is_admin: true,
        priority: 100
      }
    ];
    
    // Insérer les modules
    const { error: insertError } = await supabase
      .from('app_modules')
      .insert(modules);
      
    if (insertError) {
      console.error('Error initializing modules:', insertError);
      return;
    }
    
    console.log('Modules initialized successfully');
  } catch (error) {
    console.error('Exception in initializeModules:', error);
  }
};
