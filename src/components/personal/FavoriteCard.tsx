
import React from "react";

export const FavoriteCard = () => (
  <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
    <div className="flex gap-3 items-center mb-3">
      <div className="w-12 h-12 bg-gray-100 rounded-md"></div>
      <div>
        <h3 className="font-medium">Favori</h3>
        <p className="text-xs text-gray-500">Ajouté récemment</p>
      </div>
    </div>
    <p className="text-sm text-gray-700">
      Description du favori...
    </p>
  </div>
);
