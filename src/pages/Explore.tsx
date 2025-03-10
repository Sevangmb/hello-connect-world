
import React from 'react';
import ExploreTabsPanel from '@/components/explore/ExploreTabsPanel';
import { Card } from '@/components/ui/card';
import { PostsList } from '@/components/posts/PostsList';
import { ChallengesSection } from '@/components/explore/ChallengesSection';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const Explore = () => {
  // Component de fallback en cas d'erreur
  const fallbackUI = (
    <div className="p-6 bg-muted rounded-lg text-center">
      <h3 className="text-lg font-semibold mb-2">Une erreur est survenue</h3>
      <p className="text-muted-foreground mb-4">Nous travaillons à résoudre ce problème.</p>
    </div>
  );

  return (
    <div className="space-y-6 max-w-full">
      <h1 className="text-2xl font-bold">Explorer</h1>
      
      <Card className="p-0 overflow-hidden">
        <ExploreTabsPanel />
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Publications récentes</h2>
            <ErrorBoundary fallback={fallbackUI}>
              <PostsList />
            </ErrorBoundary>
          </Card>
        </div>
        
        <div>
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Défis actuels</h2>
            <ErrorBoundary fallback={fallbackUI}>
              <ChallengesSection />
            </ErrorBoundary>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Explore;
