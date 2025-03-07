
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PublicationsSection } from './PublicationsSection';
import { NewsSection } from './NewsSection';
import { HashtagsSection } from './HashtagsSection';
import { FavoritesSection } from './FavoritesSection';
import { TrendingSection } from './TrendingSection';

export const ExploreTabsPanel = () => {
  const [activeTab, setActiveTab] = useState('publications');

  return (
    <div className="w-full">
      <Tabs defaultValue="publications" onValueChange={setActiveTab} className="w-full">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <TabsList className="w-full flex bg-white border-b">
            <TabsTrigger 
              value="publications" 
              className={`flex-1 py-3 px-4 ${activeTab === 'publications' ? 'font-semibold text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            >
              Publications
            </TabsTrigger>
            <TabsTrigger 
              value="actualites" 
              className={`flex-1 py-3 px-4 ${activeTab === 'actualites' ? 'font-semibold text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            >
              Actualités
            </TabsTrigger>
            <TabsTrigger 
              value="hashtags" 
              className={`flex-1 py-3 px-4 ${activeTab === 'hashtags' ? 'font-semibold text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            >
              Hashtags
            </TabsTrigger>
            <TabsTrigger 
              value="favoris" 
              className={`flex-1 py-3 px-4 ${activeTab === 'favoris' ? 'font-semibold text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            >
              Favoris
            </TabsTrigger>
            <TabsTrigger 
              value="tendances" 
              className={`flex-1 py-3 px-4 ${activeTab === 'tendances' ? 'font-semibold text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            >
              Tendances
            </TabsTrigger>
          </TabsList>
          
          <div className="p-4">
            <TabsContent value="publications" className="mt-0">
              <PublicationsSection />
            </TabsContent>
            <TabsContent value="actualites" className="mt-0">
              <NewsSection />
            </TabsContent>
            <TabsContent value="hashtags" className="mt-0">
              <HashtagsSection />
            </TabsContent>
            <TabsContent value="favoris" className="mt-0">
              <FavoritesSection />
            </TabsContent>
            <TabsContent value="tendances" className="mt-0">
              <TrendingSection />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default ExploreTabsPanel;
