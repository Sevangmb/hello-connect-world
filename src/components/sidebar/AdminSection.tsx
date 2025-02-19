
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminSection() {
  return (
    <Button variant="ghost" className="w-full justify-start">
      <Settings className="mr-2 h-5 w-5" />
      Administration
    </Button>
  );
}
