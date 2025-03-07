
import { useEffect, useState } from "react";
import { seedMenuItems } from "@/services/menu/infrastructure/MenuSeeder";

export const InitializeMenuItems = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeMenuItems = async () => {
      if (!initialized) {
        await seedMenuItems();
        setInitialized(true);
      }
    };

    initializeMenuItems();
  }, [initialized]);

  return null;
};
