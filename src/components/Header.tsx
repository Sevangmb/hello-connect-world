import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14">
        <div className="flex items-center gap-2">
          <a href="/" className="text-facebook-primary text-2xl font-bold">
            social
          </a>
        </div>
        
        <div className="hidden md:flex items-center max-w-md w-full relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            type="search"
            placeholder="Rechercher..."
            className="pl-10 bg-gray-100 border-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Search className="h-5 w-5 md:hidden" />
          </button>
        </div>
      </div>
    </header>
  );
};