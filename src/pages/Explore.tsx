
import React from 'react';
import ExploreTabsPanel from '@/components/explore/ExploreTabsPanel';
import { Card } from '@/components/ui/card';
import { PostsList } from '@/components/posts/PostsList';

const Explore = () => {
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
            <PostsList />
          </Card>
        </div>
        
        <div>
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">À découvrir</h2>
            <p className="text-sm text-gray-500">Contenu à venir</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Explore;
