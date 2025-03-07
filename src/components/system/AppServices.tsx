
import React from "react";
import { InitializeMenuItems } from "./InitializeMenuItems";
import { InitializeModules } from "./InitializeModules";
import { Toaster } from "@/components/ui/toaster";

export const AppServices: React.FC = () => {
  return (
    <>
      <InitializeModules />
      <InitializeMenuItems />
      <Toaster />
    </>
  );
};

export default AppServices;
