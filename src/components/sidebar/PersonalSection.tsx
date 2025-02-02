import {
  ShoppingBag,
  Shirt,
  Camera,
  Briefcase,
  Heart,
  Pencil,
  Share2,
  PlusCircle,
  ScanLine,
  Upload,
  FileText,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const PersonalSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const safeNavigate = (path: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <AccordionItem value="personal" className="border-none">
      <AccordionTrigger className="py-2">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" />
          Mon Univers
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-1 pl-6">
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/clothes",
            })}
            onClick={() => safeNavigate("/clothes")}
          >
            <Shirt className="h-4 w-4" />
            Ma Garde-Robe
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/outfits",
            })}
            onClick={() => safeNavigate("/outfits")}
          >
            <ShoppingBag className="h-4 w-4" />
            Mes Tenues
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/outfits",
            })}
            onClick={() => safeNavigate("/outfits")}
          >
            <Pencil className="h-4 w-4" />
            Créer une Tenue
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/publish-look",
            })}
            onClick={() => safeNavigate("/publish-look")}
          >
            <Share2 className="h-4 w-4" />
            Publier un Look
          </Button>
          <AccordionItem value="add-clothes" className="border-none">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Ajouter un Vêtement
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-1 pl-6">
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/add-clothes/scan",
                  })}
                  onClick={() => safeNavigate("/add-clothes/scan")}
                >
                  <ScanLine className="h-4 w-4" />
                  Scanner étiquette
                </Button>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/add-clothes/photo",
                  })}
                  onClick={() => safeNavigate("/add-clothes/photo")}
                >
                  <Camera className="h-4 w-4" />
                  Prendre une Photo
                </Button>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/add-clothes/import",
                  })}
                  onClick={() => safeNavigate("/add-clothes/import")}
                >
                  <Upload className="h-4 w-4" />
                  Importer depuis la Galerie
                </Button>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-2", {
                    "bg-gray-100": location.pathname === "/add-clothes/manual",
                  })}
                  onClick={() => safeNavigate("/add-clothes/manual")}
                >
                  <FileText className="h-4 w-4" />
                  Saisie Manuelle
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};