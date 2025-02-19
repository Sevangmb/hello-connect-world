
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExploreSection() {
  return (
    <Button variant="ghost" className="w-full justify-start">
      <Search className="mr-2 h-5 w-5" />
      Explorer
    </Button>
  );
}
