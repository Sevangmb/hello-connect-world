import { useState, useEffect } from "react";

interface ClothingSet {
  id: number;
  name: string;
  description: string;
  hashtags?: string[];
}

export const useClothingSets = () => {
  const [clothingSets, setClothingSets] = useState<ClothingSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClothingSets = async () => {
      try {
        const response = await fetch("/api/clothing-sets");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setClothingSets(data);
      } catch (error) {
        console.error("Error fetching clothing sets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClothingSets();
  }, []);

  return { clothingSets, loading };
};
