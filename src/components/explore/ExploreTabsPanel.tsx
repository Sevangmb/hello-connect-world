
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PublicationsSection } from './PublicationsSection';
import { NewsSection } from './NewsSection';
import { HashtagsSection } from './HashtagsSection';
import { FavoritesSection } from './FavoritesSection';
import { TrendingSection } from './TrendingSection';
import { ChallengesSection } from './ChallengesSection';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const ExploreTabsPanel = () => {
  const [activeTab, setActiveTab] = useState('publications');

  // Component de fallback en cas d'erreur
  const fallbackUI = (
    <div className="p-6 bg-muted rounded-lg text-center">
      <h3 className="text-lg font-semibold mb-2">Une erreur est survenue</h3>
      <p className="text-muted-foreground mb-4">Nous travaillons à résoudre ce problème.</p>
    </div>
  );

  return (
    <div className="w-full">
      <Tabs defaultValue="publications" onValueChange={setActiveTab} className="w-full">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <TabsList className="w-full flex bg-white border-b overflow-x-auto">
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
              value="defis" 
              className={`flex-1 py-3 px-4 ${activeTab === 'defis' ? 'font-semibold text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            >
              Défis
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
              <ErrorBoundary fallback={fallbackUI}>
                <PublicationsSection />
              </ErrorBoundary>
            </TabsContent>
            <TabsContent value="actualites" className="mt-0">
              <ErrorBoundary fallback={fallbackUI}>
                <NewsSection />
              </ErrorBoundary>
            </TabsContent>
            <TabsContent value="defis" className="mt-0">
              <ErrorBoundary fallback={fallbackUI}>
                <ChallengesSection />
              </ErrorBoundary>
            </TabsContent>
            <TabsContent value="hashtags" className="mt-0">
              <ErrorBoundary fallback={fallbackUI}>
                <HashtagsSection />
              </ErrorBoundary>
            </TabsContent>
            <TabsContent value="favoris" className="mt-0">
              <ErrorBoundary fallback={fallbackUI}>
                <FavoritesSection />
              </ErrorBoundary>
            </TabsContent>
            <TabsContent value="tendances" className="mt-0">
              <ErrorBoundary fallback={fallbackUI}>
                <TrendingSection />
              </ErrorBoundary>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default ExploreTabsPanel;
