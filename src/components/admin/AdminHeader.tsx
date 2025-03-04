
import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogOut, Menu } from "lucide-react";
import { AdminMenu } from "@/components/admin/AdminMenu";

interface AdminHeaderProps {
  handleLogout: () => Promise<void>;
}

export function AdminHeader({ handleLogout }: AdminHeaderProps) {
  return (
    <div className="mb-8 flex justify-between items-center">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">FRING! Administration</h1>
        <p className="text-sm text-muted-foreground">
          Gérer votre plateforme et vos utilisateurs
        </p>
      </div>
      
      {/* Mobile menu */}
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 pt-16">
            <AdminMenu />
          </SheetContent>
        </Sheet>
        
        <Button
          variant="ghost"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}
