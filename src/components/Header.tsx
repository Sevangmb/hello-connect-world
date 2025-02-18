
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-50">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <MenuIcon className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">FRING!</h1>
        </div>
      </div>
    </header>
  );
}
