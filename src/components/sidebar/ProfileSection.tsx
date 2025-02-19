
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProfileSection() {
  return (
    <Button variant="ghost" className="w-full justify-start">
      <User className="mr-2 h-5 w-5" />
      Profil
    </Button>
  );
}
