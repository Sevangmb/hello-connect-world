
import React from "react";
import { Card } from "@/components/ui/card";

export const HashtagsSection = () => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold mb-4">Hashtags populaires</h2>
    <div className="flex flex-wrap gap-2">
      {["#mode", "#style", "#tendance", "#outfit", "#streetwear", "#vintage", "#minimaliste", "#casual", "#elegance", "#denim"].map((tag) => (
        <HashtagButton key={tag} tag={tag} />
      ))}
    </div>
  </Card>
);

const HashtagButton = ({ tag }: { tag: string }) => (
  <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition">
    {tag}
  </button>
);
