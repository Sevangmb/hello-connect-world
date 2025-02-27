
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Upload, MessageSquare, ListTree, Share2 } from "lucide-react";
import { ThemeSettings } from "./ThemeSettings";
import { LogoSettings } from "./LogoSettings";
import { MessagesSettings } from "./MessagesSettings";
import { CategoriesSettings } from "./CategoriesSettings";
import { SocialSettings } from "./SocialSettings";

interface SettingsTabsProps {
  settings: any;
  categories: any[] | undefined;
  isLoading: boolean;
  onSave: (key: string, value: any) => Promise<void>;
}

export function SettingsTabs({ settings, categories, isLoading, onSave }: SettingsTabsProps) {
  return (
    <Tabs defaultValue="theme" className="space-y-4">
      <TabsList>
        <TabsTrigger value="theme" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Thème
        </TabsTrigger>
        <TabsTrigger value="logo" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Logo
        </TabsTrigger>
        <TabsTrigger value="messages" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Messages
        </TabsTrigger>
        <TabsTrigger value="categories" className="flex items-center gap-2">
          <ListTree className="h-4 w-4" />
          Catégories
        </TabsTrigger>
        <TabsTrigger value="social" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Réseaux sociaux
        </TabsTrigger>
      </TabsList>

      <TabsContent value="theme" className="space-y-4">
        <ThemeSettings
          settings={settings}
          isLoading={isLoading}
          onSave={onSave}
        />
      </TabsContent>

      <TabsContent value="logo" className="space-y-4">
        <LogoSettings
          settings={settings}
          isLoading={isLoading}
          onSave={onSave}
        />
      </TabsContent>

      <TabsContent value="messages" className="space-y-4">
        <MessagesSettings
          settings={settings}
          isLoading={isLoading}
          onSave={onSave}
        />
      </TabsContent>

      <TabsContent value="categories" className="space-y-4">
        <CategoriesSettings
          categories={categories}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="social" className="space-y-4">
        <SocialSettings
          settings={settings}
          isLoading={isLoading}
          onSave={onSave}
        />
      </TabsContent>
    </Tabs>
  );
}
