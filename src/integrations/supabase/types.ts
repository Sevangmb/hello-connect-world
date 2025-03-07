export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      app_modules: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_admin: boolean
          is_core: boolean
          name: string
          priority: number
          status: Database["public"]["Enums"]["module_status"]
          updated_at: string
          version: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_admin?: boolean
          is_core?: boolean
          name: string
          priority?: number
          status?: Database["public"]["Enums"]["module_status"]
          updated_at?: string
          version?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_admin?: boolean
          is_core?: boolean
          name?: string
          priority?: number
          status?: Database["public"]["Enums"]["module_status"]
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          created_at: string
          description: string | null
          icon_url: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          quantity: number
          shop_item_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          quantity?: number
          shop_item_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          quantity?: number
          shop_item_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_shop_item_id_fkey"
            columns: ["shop_item_id"]
            isOneToOne: false
            referencedRelation: "shop_items"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_hashtags: {
        Row: {
          challenge_id: string | null
          created_at: string
          hashtag_id: string | null
          id: string
        }
        Insert: {
          challenge_id?: string | null
          created_at?: string
          hashtag_id?: string | null
          id?: string
        }
        Update: {
          challenge_id?: string | null
          created_at?: string
          hashtag_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_hashtags_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_hashtags_hashtag_id_fkey"
            columns: ["hashtag_id"]
            isOneToOne: false
            referencedRelation: "hashtags"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_participants: {
        Row: {
          challenge_id: string
          comment: string | null
          created_at: string
          id: string
          moderated_at: string | null
          moderated_by: string | null
          moderation_reason: string | null
          moderation_status: string | null
          outfit_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          comment?: string | null
          created_at?: string
          id?: string
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_reason?: string | null
          moderation_status?: string | null
          outfit_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_reason?: string | null
          moderation_status?: string | null
          outfit_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_participants_outfit_id_fkey"
            columns: ["outfit_id"]
            isOneToOne: false
            referencedRelation: "outfits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_participants_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_votes: {
        Row: {
          challenge_id: string
          created_at: string
          id: string
          participant_id: string
          voter_id: string
        }
        Insert: {
          challenge_id: string
          created_at?: string
          id?: string
          participant_id: string
          voter_id: string
        }
        Update: {
          challenge_id?: string
          created_at?: string
          id?: string
          participant_id?: string
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_votes_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_votes_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "challenge_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          end_date: string
          id: string
          is_voting_enabled: boolean
          participation_type: string
          reward_description: string | null
          rules: string | null
          start_date: string
          status: Database["public"]["Enums"]["challenge_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          end_date: string
          id?: string
          is_voting_enabled?: boolean
          participation_type?: string
          reward_description?: string | null
          rules?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["challenge_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          end_date?: string
          id?: string
          is_voting_enabled?: boolean
          participation_type?: string
          reward_description?: string | null
          rules?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["challenge_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenges_creator_id_profiles_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_messages: {
        Row: {
          channel_id: string
          content: string
          created_at: string
          id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          channel_id: string
          content: string
          created_at?: string
          id?: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          channel_id?: string
          content?: string
          created_at?: string
          id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "group_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channel_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clothes: {
        Row: {
          archived: boolean | null
          brand: string | null
          category: string
          color: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_for_sale: boolean | null
          last_worn_date: string | null
          material: string | null
          name: string
          needs_alteration: boolean | null
          original_price: number | null
          price: number | null
          purchase_date: string | null
          sale_price: number | null
          shop_id: string | null
          size: string | null
          style: string | null
          subcategory: string | null
          updated_at: string
          user_id: string
          weather_categories: string[] | null
        }
        Insert: {
          archived?: boolean | null
          brand?: string | null
          category: string
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_for_sale?: boolean | null
          last_worn_date?: string | null
          material?: string | null
          name: string
          needs_alteration?: boolean | null
          original_price?: number | null
          price?: number | null
          purchase_date?: string | null
          sale_price?: number | null
          shop_id?: string | null
          size?: string | null
          style?: string | null
          subcategory?: string | null
          updated_at?: string
          user_id: string
          weather_categories?: string[] | null
        }
        Update: {
          archived?: boolean | null
          brand?: string | null
          category?: string
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_for_sale?: boolean | null
          last_worn_date?: string | null
          material?: string | null
          name?: string
          needs_alteration?: boolean | null
          original_price?: number | null
          price?: number | null
          purchase_date?: string | null
          sale_price?: number | null
          shop_id?: string | null
          size?: string | null
          style?: string | null
          subcategory?: string | null
          updated_at?: string
          user_id?: string
          weather_categories?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "clothes_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clothes_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clothes_hashtags: {
        Row: {
          clothes_id: string
          created_at: string
          hashtag_id: string
          id: string
        }
        Insert: {
          clothes_id: string
          created_at?: string
          hashtag_id: string
          id?: string
        }
        Update: {
          clothes_id?: string
          created_at?: string
          hashtag_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clothes_hashtags_clothes_id_fkey"
            columns: ["clothes_id"]
            isOneToOne: false
            referencedRelation: "clothes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clothes_hashtags_hashtag_id_fkey"
            columns: ["hashtag_id"]
            isOneToOne: false
            referencedRelation: "hashtags"
            referencedColumns: ["id"]
          },
        ]
      }
      clothes_wear_history: {
        Row: {
          clothes_id: string
          created_at: string
          id: string
          user_id: string
          worn_date: string
        }
        Insert: {
          clothes_id: string
          created_at?: string
          id?: string
          user_id: string
          worn_date: string
        }
        Update: {
          clothes_id?: string
          created_at?: string
          id?: string
          user_id?: string
          worn_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "clothes_wear_history_clothes_id_fkey"
            columns: ["clothes_id"]
            isOneToOne: false
            referencedRelation: "clothes"
            referencedColumns: ["id"]
          },
        ]
      }
      favorite_clothes: {
        Row: {
          clothes_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          clothes_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          clothes_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorite_clothes_clothes_id_fkey"
            columns: ["clothes_id"]
            isOneToOne: false
            referencedRelation: "clothes"
            referencedColumns: ["id"]
          },
        ]
      }
      favorite_shops: {
        Row: {
          created_at: string
          id: string
          shop_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          shop_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          shop_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorite_shops_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorite_shops_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friendships_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_channels: {
        Row: {
          created_at: string
          description: string | null
          group_id: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          group_id: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          group_id?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_channels_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          created_at: string
          group_id: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_messages: {
        Row: {
          content: string
          created_at: string
          group_id: string
          id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          group_id: string
          id?: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          group_id?: string
          id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      hashtags: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      menu_categories: {
        Row: {
          code: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          position: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          position?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          position?: number
          updated_at?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          category: Database["public"]["Enums"]["menu_item_category"]
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          is_visible: boolean
          module_code: string | null
          name: string
          parent_id: string | null
          path: string
          position: number
          requires_admin: boolean
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["menu_item_category"]
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          is_visible?: boolean
          module_code?: string | null
          name: string
          parent_id?: string | null
          path: string
          position?: number
          requires_admin?: boolean
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["menu_item_category"]
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          is_visible?: boolean
          module_code?: string | null
          name?: string
          parent_id?: string | null
          path?: string
          position?: number
          requires_admin?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_module_code_fkey"
            columns: ["module_code"]
            isOneToOne: false
            referencedRelation: "app_modules"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "menu_items_module_code_fkey"
            columns: ["module_code"]
            isOneToOne: false
            referencedRelation: "module_dependencies_view"
            referencedColumns: ["module_code"]
          },
          {
            foreignKeyName: "menu_items_module_code_fkey"
            columns: ["module_code"]
            isOneToOne: false
            referencedRelation: "module_dependencies_view"
            referencedColumns: ["dependency_code"]
          },
          {
            foreignKeyName: "menu_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      module_dependencies: {
        Row: {
          created_at: string
          dependency_id: string
          id: string
          is_required: boolean
          module_id: string
        }
        Insert: {
          created_at?: string
          dependency_id: string
          id?: string
          is_required?: boolean
          module_id: string
        }
        Update: {
          created_at?: string
          dependency_id?: string
          id?: string
          is_required?: boolean
          module_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_dependencies_dependency_id_fkey"
            columns: ["dependency_id"]
            isOneToOne: false
            referencedRelation: "app_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_dependencies_dependency_id_fkey"
            columns: ["dependency_id"]
            isOneToOne: false
            referencedRelation: "module_dependencies_view"
            referencedColumns: ["module_id"]
          },
          {
            foreignKeyName: "module_dependencies_dependency_id_fkey"
            columns: ["dependency_id"]
            isOneToOne: false
            referencedRelation: "module_dependencies_view"
            referencedColumns: ["dependency_id"]
          },
          {
            foreignKeyName: "module_dependencies_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "app_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_dependencies_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "module_dependencies_view"
            referencedColumns: ["module_id"]
          },
          {
            foreignKeyName: "module_dependencies_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "module_dependencies_view"
            referencedColumns: ["dependency_id"]
          },
        ]
      }
      module_features: {
        Row: {
          created_at: string
          description: string | null
          feature_code: string
          feature_name: string
          id: string
          is_enabled: boolean
          module_code: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          feature_code: string
          feature_name: string
          id?: string
          is_enabled?: boolean
          module_code: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          feature_code?: string
          feature_name?: string
          id?: string
          is_enabled?: boolean
          module_code?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_features_module_code_fkey"
            columns: ["module_code"]
            isOneToOne: false
            referencedRelation: "app_modules"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "module_features_module_code_fkey"
            columns: ["module_code"]
            isOneToOne: false
            referencedRelation: "module_dependencies_view"
            referencedColumns: ["module_code"]
          },
          {
            foreignKeyName: "module_features_module_code_fkey"
            columns: ["module_code"]
            isOneToOne: false
            referencedRelation: "module_dependencies_view"
            referencedColumns: ["dependency_code"]
          },
        ]
      }
      module_usage_stats: {
        Row: {
          created_at: string
          id: string
          last_used: string | null
          module_code: string
          updated_at: string
          usage_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_used?: string | null
          module_code: string
          updated_at?: string
          usage_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          last_used?: string | null
          module_code?: string
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          actor_id: string | null
          created_at: string
          id: string
          post_id: string | null
          read: boolean | null
          type: string
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          read?: boolean | null
          type: string
          user_id: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          read?: boolean | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_actor_id_profiles_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price_at_time: number
          quantity: number
          shop_item_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price_at_time: number
          quantity?: number
          shop_item_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price_at_time?: number
          quantity?: number
          shop_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_shop_item_id_fkey"
            columns: ["shop_item_id"]
            isOneToOne: false
            referencedRelation: "shop_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_shipments: {
        Row: {
          actual_delivery_date: string | null
          buyer_confirmation_deadline: string | null
          buyer_confirmed: boolean | null
          carrier_id: string | null
          carrier_name: string | null
          created_at: string
          estimated_delivery_date: string | null
          id: string
          insurance_cost: number | null
          insurance_selected: boolean | null
          notes: string | null
          order_id: string
          shipped_at: string | null
          shipping_address: Json
          shipping_cost: number | null
          shipping_label_url: string | null
          shipping_method: string
          status: string
          tracking_number: string | null
          tracking_url: string | null
          updated_at: string
        }
        Insert: {
          actual_delivery_date?: string | null
          buyer_confirmation_deadline?: string | null
          buyer_confirmed?: boolean | null
          carrier_id?: string | null
          carrier_name?: string | null
          created_at?: string
          estimated_delivery_date?: string | null
          id?: string
          insurance_cost?: number | null
          insurance_selected?: boolean | null
          notes?: string | null
          order_id: string
          shipped_at?: string | null
          shipping_address: Json
          shipping_cost?: number | null
          shipping_label_url?: string | null
          shipping_method?: string
          status?: string
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
        }
        Update: {
          actual_delivery_date?: string | null
          buyer_confirmation_deadline?: string | null
          buyer_confirmed?: boolean | null
          carrier_id?: string | null
          carrier_name?: string | null
          created_at?: string
          estimated_delivery_date?: string | null
          id?: string
          insurance_cost?: number | null
          insurance_selected?: boolean | null
          notes?: string | null
          order_id?: string
          shipped_at?: string | null
          shipping_address?: Json
          shipping_cost?: number | null
          shipping_label_url?: string | null
          shipping_method?: string
          status?: string
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_shipments_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "shipping_carriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_shipments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_confirmed: boolean | null
          buyer_id: string
          cancellation_reason: string | null
          cancelled_at: string | null
          commission_amount: number | null
          confirmed_at: string | null
          created_at: string
          delivery_type: string | null
          id: string
          insurance_cost: number | null
          meeting_location: string | null
          meeting_time: string | null
          payment_method: string | null
          payment_status: string
          payment_type: string
          pickup_location: string | null
          qr_code: string | null
          reservation_expiry: string | null
          seller_confirmed: boolean | null
          seller_id: string
          shipping_address: Json | null
          shipping_cost: number | null
          shipping_method: string | null
          shipping_required: boolean | null
          shipping_status: string | null
          shop_pickup_time: string | null
          shop_validation_time: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          total_amount: number
          transaction_type: string
        }
        Insert: {
          buyer_confirmed?: boolean | null
          buyer_id: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          commission_amount?: number | null
          confirmed_at?: string | null
          created_at?: string
          delivery_type?: string | null
          id?: string
          insurance_cost?: number | null
          meeting_location?: string | null
          meeting_time?: string | null
          payment_method?: string | null
          payment_status?: string
          payment_type?: string
          pickup_location?: string | null
          qr_code?: string | null
          reservation_expiry?: string | null
          seller_confirmed?: boolean | null
          seller_id: string
          shipping_address?: Json | null
          shipping_cost?: number | null
          shipping_method?: string | null
          shipping_required?: boolean | null
          shipping_status?: string | null
          shop_pickup_time?: string | null
          shop_validation_time?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_amount: number
          transaction_type?: string
        }
        Update: {
          buyer_confirmed?: boolean | null
          buyer_id?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          commission_amount?: number | null
          confirmed_at?: string | null
          created_at?: string
          delivery_type?: string | null
          id?: string
          insurance_cost?: number | null
          meeting_location?: string | null
          meeting_time?: string | null
          payment_method?: string | null
          payment_status?: string
          payment_type?: string
          pickup_location?: string | null
          qr_code?: string | null
          reservation_expiry?: string | null
          seller_confirmed?: boolean | null
          seller_id?: string
          shipping_address?: Json | null
          shipping_cost?: number | null
          shipping_method?: string | null
          shipping_required?: boolean | null
          shipping_status?: string | null
          shop_pickup_time?: string | null
          shop_validation_time?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_amount?: number
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      outfit_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          outfit_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          outfit_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          outfit_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outfit_comments_outfit_id_fkey"
            columns: ["outfit_id"]
            isOneToOne: false
            referencedRelation: "outfits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outfit_comments_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      outfit_items: {
        Row: {
          clothes_id: string
          created_at: string
          id: string
          outfit_id: string
          position: number
        }
        Insert: {
          clothes_id: string
          created_at?: string
          id?: string
          outfit_id: string
          position?: number
        }
        Update: {
          clothes_id?: string
          created_at?: string
          id?: string
          outfit_id?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "outfit_items_clothes_id_fkey"
            columns: ["clothes_id"]
            isOneToOne: false
            referencedRelation: "clothes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outfit_items_outfit_id_fkey"
            columns: ["outfit_id"]
            isOneToOne: false
            referencedRelation: "outfits"
            referencedColumns: ["id"]
          },
        ]
      }
      outfit_likes: {
        Row: {
          created_at: string
          id: string
          outfit_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          outfit_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          outfit_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outfit_likes_outfit_id_fkey"
            columns: ["outfit_id"]
            isOneToOne: false
            referencedRelation: "outfits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outfit_likes_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      outfit_ratings: {
        Row: {
          created_at: string
          id: string
          outfit_id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          outfit_id: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          outfit_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outfit_ratings_outfit_id_fkey"
            columns: ["outfit_id"]
            isOneToOne: false
            referencedRelation: "outfits"
            referencedColumns: ["id"]
          },
        ]
      }
      outfit_weather_suggestions: {
        Row: {
          created_at: string
          id: string
          outfit_id: string
          temperature: number | null
          user_id: string
          weather_description: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          outfit_id: string
          temperature?: number | null
          user_id: string
          weather_description?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          outfit_id?: string
          temperature?: number | null
          user_id?: string
          weather_description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outfit_weather_suggestions_outfit_id_fkey"
            columns: ["outfit_id"]
            isOneToOne: false
            referencedRelation: "outfits"
            referencedColumns: ["id"]
          },
        ]
      }
      outfits: {
        Row: {
          bottom_id: string | null
          category: string
          comments_count: number
          created_at: string
          description: string | null
          id: string
          is_favorite: boolean
          likes_count: number
          name: string
          season: string
          shoes_id: string | null
          status: string
          top_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bottom_id?: string | null
          category?: string
          comments_count?: number
          created_at?: string
          description?: string | null
          id?: string
          is_favorite?: boolean
          likes_count?: number
          name: string
          season?: string
          shoes_id?: string | null
          status?: string
          top_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bottom_id?: string | null
          category?: string
          comments_count?: number
          created_at?: string
          description?: string | null
          id?: string
          is_favorite?: boolean
          likes_count?: number
          name?: string
          season?: string
          shoes_id?: string | null
          status?: string
          top_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outfits_bottom_id_fkey"
            columns: ["bottom_id"]
            isOneToOne: false
            referencedRelation: "clothes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outfits_shoes_id_fkey"
            columns: ["shoes_id"]
            isOneToOne: false
            referencedRelation: "clothes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outfits_top_id_fkey"
            columns: ["top_id"]
            isOneToOne: false
            referencedRelation: "clothes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outfits_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      outfits_hashtags: {
        Row: {
          created_at: string
          hashtag_id: string
          id: string
          outfit_id: string
        }
        Insert: {
          created_at?: string
          hashtag_id: string
          id?: string
          outfit_id: string
        }
        Update: {
          created_at?: string
          hashtag_id?: string
          id?: string
          outfit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outfits_hashtags_hashtag_id_fkey"
            columns: ["hashtag_id"]
            isOneToOne: false
            referencedRelation: "hashtags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outfits_hashtags_outfit_id_fkey"
            columns: ["outfit_id"]
            isOneToOne: false
            referencedRelation: "outfits"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string | null
          created_at: string
          id: string
          outfit_id: string | null
          updated_at: string
          user_id: string
          visibility: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          outfit_id?: string | null
          updated_at?: string
          user_id: string
          visibility?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          outfit_id?: string | null
          updated_at?: string
          user_id?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_outfit_id_fkey"
            columns: ["outfit_id"]
            isOneToOne: false
            referencedRelation: "outfits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      private_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          receiver_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          receiver_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          receiver_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "private_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "private_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          billing_address: Json | null
          created_at: string
          default_payment_method_id: string | null
          email_notifications: boolean | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          phone: string | null
          preferences: Json | null
          preferred_language: string | null
          stripe_customer_id: string | null
          updated_at: string
          username: string | null
          visibility: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          billing_address?: Json | null
          created_at?: string
          default_payment_method_id?: string | null
          email_notifications?: boolean | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          phone?: string | null
          preferences?: Json | null
          preferred_language?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
          username?: string | null
          visibility?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          billing_address?: Json | null
          created_at?: string
          default_payment_method_id?: string | null
          email_notifications?: boolean | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          phone?: string | null
          preferences?: Json | null
          preferred_language?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
          username?: string | null
          visibility?: string
        }
        Relationships: []
      }
      publications: {
        Row: {
          content: string
          created_at: string
          group_id: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          group_id?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          group_id?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "publications_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          amount: number
          created_at: string
          id: number
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: never
        }
        Update: {
          amount?: number
          created_at?: string
          id?: never
        }
        Relationships: []
      }
      secrets: {
        Row: {
          created_at: string
          id: string
          key: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          value?: string
        }
        Relationships: []
      }
      shipping_carriers: {
        Row: {
          api_enabled: boolean | null
          api_endpoint: string | null
          api_key_required: boolean | null
          base_price: number | null
          created_at: string
          description: string | null
          id: string
          insurance_available: boolean | null
          insurance_price: number | null
          is_active: boolean | null
          logo_url: string | null
          name: string
          shipping_label_api_endpoint: string | null
          shipping_time_max: number | null
          shipping_time_min: number | null
          tracking_api_endpoint: string | null
          tracking_url_template: string | null
          type: Database["public"]["Enums"]["shipping_carrier_type"]
          updated_at: string
        }
        Insert: {
          api_enabled?: boolean | null
          api_endpoint?: string | null
          api_key_required?: boolean | null
          base_price?: number | null
          created_at?: string
          description?: string | null
          id?: string
          insurance_available?: boolean | null
          insurance_price?: number | null
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          shipping_label_api_endpoint?: string | null
          shipping_time_max?: number | null
          shipping_time_min?: number | null
          tracking_api_endpoint?: string | null
          tracking_url_template?: string | null
          type?: Database["public"]["Enums"]["shipping_carrier_type"]
          updated_at?: string
        }
        Update: {
          api_enabled?: boolean | null
          api_endpoint?: string | null
          api_key_required?: boolean | null
          base_price?: number | null
          created_at?: string
          description?: string | null
          id?: string
          insurance_available?: boolean | null
          insurance_price?: number | null
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          shipping_label_api_endpoint?: string | null
          shipping_time_max?: number | null
          shipping_time_min?: number | null
          tracking_api_endpoint?: string | null
          tracking_url_template?: string | null
          type?: Database["public"]["Enums"]["shipping_carrier_type"]
          updated_at?: string
        }
        Relationships: []
      }
      shipping_labels: {
        Row: {
          carrier_id: string | null
          carrier_response: Json | null
          created_at: string
          dimensions: Json | null
          error_message: string | null
          id: string
          label_data: Json | null
          label_url: string
          order_shipment_id: string | null
          shipping_cost: number | null
          status: string
          tracking_number: string | null
          tracking_url: string | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          carrier_id?: string | null
          carrier_response?: Json | null
          created_at?: string
          dimensions?: Json | null
          error_message?: string | null
          id?: string
          label_data?: Json | null
          label_url: string
          order_shipment_id?: string | null
          shipping_cost?: number | null
          status?: string
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          carrier_id?: string | null
          carrier_response?: Json | null
          created_at?: string
          dimensions?: Json | null
          error_message?: string | null
          id?: string
          label_data?: Json | null
          label_url?: string
          order_shipment_id?: string | null
          shipping_cost?: number | null
          status?: string
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shipping_labels_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "shipping_carriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipping_labels_order_shipment_id_fkey"
            columns: ["order_shipment_id"]
            isOneToOne: false
            referencedRelation: "order_shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_items: {
        Row: {
          clothes_id: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string | null
          original_price: number | null
          price: number
          shop_id: string
          status: string
          stock: number
          updated_at: string
        }
        Insert: {
          clothes_id: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          original_price?: number | null
          price: number
          shop_id: string
          status?: string
          stock?: number
          updated_at?: string
        }
        Update: {
          clothes_id?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          original_price?: number | null
          price?: number
          shop_id?: string
          status?: string
          stock?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_shop_items_clothes"
            columns: ["clothes_id"]
            isOneToOne: false
            referencedRelation: "clothes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_items_clothes_id_fkey"
            columns: ["clothes_id"]
            isOneToOne: false
            referencedRelation: "clothes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_items_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_order_items: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          order_id: string
          price_at_time: number
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          order_id: string
          price_at_time: number
          quantity: number
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          order_id?: string
          price_at_time?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "shop_order_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "shop_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "shop_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_orders: {
        Row: {
          created_at: string | null
          customer_id: string
          delivery_address: Json
          delivery_fee: number
          id: string
          payment_status: string
          shop_id: string
          status: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          delivery_address: Json
          delivery_fee?: number
          id?: string
          payment_status: string
          shop_id: string
          status: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          delivery_address?: Json
          delivery_fee?: number
          id?: string
          payment_status?: string
          shop_id?: string
          status?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shop_orders_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          shop_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          shop_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          shop_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_reviews_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_settings: {
        Row: {
          auto_accept_orders: boolean
          created_at: string
          delivery_options: string[]
          id: string
          notification_preferences: Json
          payment_methods: string[]
          shop_id: string
          updated_at: string
        }
        Insert: {
          auto_accept_orders?: boolean
          created_at?: string
          delivery_options?: string[]
          id?: string
          notification_preferences?: Json
          payment_methods?: string[]
          shop_id: string
          updated_at?: string
        }
        Update: {
          auto_accept_orders?: boolean
          created_at?: string
          delivery_options?: string[]
          id?: string
          notification_preferences?: Json
          payment_methods?: string[]
          shop_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_settings_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shops: {
        Row: {
          address: string | null
          average_rating: number | null
          categories: string[] | null
          created_at: string
          description: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          opening_hours: Json | null
          phone: string | null
          rating_count: number | null
          status: string
          total_ratings: number | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          average_rating?: number | null
          categories?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          opening_hours?: Json | null
          phone?: string | null
          rating_count?: number | null
          status?: string
          total_ratings?: number | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          average_rating?: number | null
          categories?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          opening_hours?: Json | null
          phone?: string | null
          rating_count?: number | null
          status?: string
          total_ratings?: number | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shops_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          order_index: number | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          order_index?: number | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          order_index?: number | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content: string
          created_at: string
          description: string | null
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          description?: string | null
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      site_stats: {
        Row: {
          category: string
          id: number
          metric: string
          updated_at: string
          value: number
        }
        Insert: {
          category: string
          id?: never
          metric: string
          updated_at?: string
          value: number
        }
        Update: {
          category?: string
          id?: never
          metric?: string
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      suitcase_folders: {
        Row: {
          created_at: string
          id: string
          name: string
          parent_folder_id: string | null
          suitcase_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          parent_folder_id?: string | null
          suitcase_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          parent_folder_id?: string | null
          suitcase_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suitcase_folders_parent_folder_id_fkey"
            columns: ["parent_folder_id"]
            isOneToOne: false
            referencedRelation: "suitcase_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suitcase_folders_suitcase_id_fkey"
            columns: ["suitcase_id"]
            isOneToOne: false
            referencedRelation: "suitcases"
            referencedColumns: ["id"]
          },
        ]
      }
      suitcase_items: {
        Row: {
          clothes_id: string
          created_at: string
          folder_id: string | null
          id: string
          quantity: number
          suitcase_id: string
        }
        Insert: {
          clothes_id: string
          created_at?: string
          folder_id?: string | null
          id?: string
          quantity?: number
          suitcase_id: string
        }
        Update: {
          clothes_id?: string
          created_at?: string
          folder_id?: string | null
          id?: string
          quantity?: number
          suitcase_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suitcase_items_clothes_id_fkey"
            columns: ["clothes_id"]
            isOneToOne: false
            referencedRelation: "clothes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suitcase_items_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "suitcase_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suitcase_items_suitcase_id_fkey"
            columns: ["suitcase_id"]
            isOneToOne: false
            referencedRelation: "suitcases"
            referencedColumns: ["id"]
          },
        ]
      }
      suitcase_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          suitcase_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          suitcase_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          suitcase_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "suitcase_notes_suitcase_id_fkey"
            columns: ["suitcase_id"]
            isOneToOne: false
            referencedRelation: "suitcases"
            referencedColumns: ["id"]
          },
        ]
      }
      suitcase_outfits: {
        Row: {
          created_at: string
          folder_id: string | null
          id: string
          outfit_id: string
          suitcase_id: string
        }
        Insert: {
          created_at?: string
          folder_id?: string | null
          id?: string
          outfit_id: string
          suitcase_id: string
        }
        Update: {
          created_at?: string
          folder_id?: string | null
          id?: string
          outfit_id?: string
          suitcase_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suitcase_outfits_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "suitcase_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suitcase_outfits_outfit_id_fkey"
            columns: ["outfit_id"]
            isOneToOne: false
            referencedRelation: "outfits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suitcase_outfits_suitcase_id_fkey"
            columns: ["suitcase_id"]
            isOneToOne: false
            referencedRelation: "suitcases"
            referencedColumns: ["id"]
          },
        ]
      }
      suitcase_stats: {
        Row: {
          avg_items_per_suitcase: number | null
          id: string
          total_suitcases: number | null
          updated_at: string | null
        }
        Insert: {
          avg_items_per_suitcase?: number | null
          id?: string
          total_suitcases?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_items_per_suitcase?: number | null
          id?: string
          total_suitcases?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      suitcases: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          parent_id: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["suitcase_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          parent_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["suitcase_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["suitcase_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suitcases_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "suitcases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suitcases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          metadata: Json | null
          order_id: string | null
          read: boolean
          type: Database["public"]["Enums"]["transaction_notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          order_id?: string | null
          read?: boolean
          type: Database["public"]["Enums"]["transaction_notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          order_id?: string | null
          read?: boolean
          type?: Database["public"]["Enums"]["transaction_notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          order_id: string | null
          rating: number
          reviewed_id: string | null
          reviewer_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          order_id?: string | null
          rating: number
          reviewed_id?: string | null
          reviewer_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          order_id?: string | null
          rating?: number
          reviewed_id?: string | null
          reviewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          awarded_at: string
          badge_id: string
          challenge_id: string | null
          id: string
          user_id: string
        }
        Insert: {
          awarded_at?: string
          badge_id: string
          challenge_id?: string | null
          id?: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          badge_id?: string
          challenge_id?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorite_shops: {
        Row: {
          created_at: string | null
          shop_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          shop_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          shop_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorite_shops_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      user_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          reason: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          reason?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          reason?: string | null
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      module_dependencies_view: {
        Row: {
          dependency_code: string | null
          dependency_id: string | null
          dependency_name: string | null
          dependency_status: Database["public"]["Enums"]["module_status"] | null
          is_required: boolean | null
          module_code: string | null
          module_id: string | null
          module_name: string | null
          module_status: Database["public"]["Enums"]["module_status"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_and_award_badges: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
      decrement_outfit_likes: {
        Args: {
          outfit_id: string
        }
        Returns: undefined
      }
      delete_suitcase_items: {
        Args: {
          suitcase_id_param: string
        }
        Returns: undefined
      }
      handle_new_group: {
        Args: {
          group_name: string
        }
        Returns: undefined
      }
      increment_module_usage: {
        Args: {
          module_code: string
        }
        Returns: undefined
      }
      increment_outfit_likes: {
        Args: {
          outfit_id: string
        }
        Returns: undefined
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      is_module_active: {
        Args: {
          module_code: string
        }
        Returns: boolean
      }
      process_order_payment:
        | {
            Args: {
              order_id: number
              payment_method_id: string
            }
            Returns: undefined
          }
        | {
            Args: {
              order_id: string
              payment_method_id: string
            }
            Returns: undefined
          }
      update_shop_average_rating: {
        Args: {
          shop_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      challenge_status: "active" | "completed"
      menu_item_category:
        | "main"
        | "admin"
        | "system"
        | "marketplace"
        | "social"
        | "utility"
      module_status: "active" | "inactive" | "degraded" | "maintenance"
      shipping_carrier_type: "integrated" | "manual"
      suitcase_status: "active" | "archived"
      transaction_notification_type:
        | "order_created"
        | "payment_received"
        | "order_confirmed"
        | "order_shipped"
        | "order_delivered"
        | "order_completed"
        | "order_cancelled"
        | "refund_requested"
        | "refund_processed"
        | "payout_processed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
