import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VirtualTryOnForm } from "./VirtualTryOnForm";
import { ExtractClothingForm } from "./ExtractClothingForm";
import { Shirt, Scissors } from "lucide-react";

export const VirtualTryOnTabs = () => {
  return (
    <Tabs defaultValue="try-on" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="try-on" className="space-x-2">
          <Shirt className="h-4 w-4" />
          <span>Essayage</span>
        </TabsTrigger>
        <TabsTrigger value="extract" className="space-x-2">
          <Scissors className="h-4 w-4" />
          <span>Extraction</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="try-on">
        <VirtualTryOnForm />
      </TabsContent>
      <TabsContent value="extract">
        <ExtractClothingForm />
      </TabsContent>
    </Tabs>
  );
};
