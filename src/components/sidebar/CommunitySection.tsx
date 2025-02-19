
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CommunitySection() {
  return (
    <Button variant="ghost" className="w-full justify-start">
      <Users className="mr-2 h-5 w-5" />
      Communauté
    </Button>
  );
}
