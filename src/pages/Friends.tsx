
import React from 'react';
import { FindFriendsTabs } from '@/components/friends/FindFriendsTabs';

const Friends = () => {
  return (
    <div className="container max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Amis</h1>
      <FindFriendsTabs />
    </div>
  );
};

export default Friends;
