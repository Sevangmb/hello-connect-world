
import { useEffect, useState } from "react";
import { initializeModules } from "@/hooks/modules/ModuleInitializer";

export const InitializeModules = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      if (!initialized) {
        await initializeModules();
        setInitialized(true);
      }
    };

    initialize();
  }, [initialized]);

  return null;
};
