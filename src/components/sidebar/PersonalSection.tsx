
import { ShoppingBag, Shirt, Camera, Briefcase, Heart, Pencil, Share2, PlusCircle, ScanLine, Upload, FileText, Shirt as ShirtIcon, ShoppingCart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const PersonalSection = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
          <Button variant="ghost" className={cn("w-full justify-start gap-2", {
            "bg-gray-100": location.pathname === "/cart"
          })} onClick={() => navigate("/cart")}>
            <ShoppingCart className="h-4 w-4" />
            Mon Panier
          </Button>
          <Button variant="ghost" className={cn("w-full justify-start gap-2", {
            "bg-gray-100": location.pathname === "/clothes"
          })} onClick={() => navigate("/clothes")}>
            <Shirt className="h-4 w-4" />
            Ma Garde-Robe
          </Button>
          <Button variant="ghost" className={cn("w-full justify-start gap-2", {
            "bg-gray-100": location.pathname === "/outfits"
          })} onClick={() => navigate("/outfits")}>
            <ShoppingBag className="h-4 w-4" />
            Mes Tenues
          </Button>
          <Button variant="ghost" className={cn("w-full justify-start gap-2", {
            "bg-gray-100": location.pathname === "/virtual-tryon"
          })} onClick={() => navigate("/virtual-tryon")}>
            <ShirtIcon className="h-4 w-4" />
            Essayage Virtuel
          </Button>
          <Button variant="ghost" className={cn("w-full justify-start gap-2", {
            "bg-gray-100": location.pathname === "/looks"
          })} onClick={() => navigate("/looks")}>
            <Camera className="h-4 w-4" />
            Mes Looks
          </Button>
          <Button variant="ghost" className={cn("w-full justify-start gap-2", {
            "bg-gray-100": location.pathname === "/suitcases"
          })} onClick={() => navigate("/suitcases")}>
            <Briefcase className="h-4 w-4" />
            Mes Valises
          </Button>
          <Button variant="ghost" className={cn("w-full justify-start gap-2", {
            "bg-gray-100": location.pathname === "/favorites"
          })} onClick={() => navigate("/favorites")}>
            <Heart className="h-4 w-4" />
            Mes Favoris
          </Button>
          <Button variant="ghost" className={cn("w-full justify-start gap-2", {
            "bg-gray-100": location.pathname === "/outfits"
          })} onClick={() => navigate("/outfits")}>
            <Pencil className="h-4 w-4" />
            Créer une Tenue
          </Button>
          <Button variant="ghost" className={cn("w-full justify-start gap-2", {
            "bg-gray-100": location.pathname === "/publish-look"
          })} onClick={() => navigate("/publish-look")}>
            <Share2 className="h-4 w-4" />
            Publier un Look
          </Button>
          <AccordionItem value="add-clothes" className="border-none">
            <AccordionContent>
              <div className="flex flex-col gap-1 pl-6">
                <Button variant="ghost" className={cn("w-full justify-start gap-2", {
                  "bg-gray-100": location.pathname === "/add-clothes/scan"
                })} onClick={() => navigate("/add-clothes/scan")}>
                  <ScanLine className="h-4 w-4" />
                  Scanner étiquette
                </Button>
                <Button variant="ghost" className={cn("w-full justify-start gap-2", {
                  "bg-gray-100": location.pathname === "/add-clothes/photo"
                })} onClick={() => navigate("/add-clothes/photo")}>
                  <Camera className="h-4 w-4" />
                  Prendre une Photo
                </Button>
                <Button variant="ghost" className={cn("w-full justify-start gap-2", {
                  "bg-gray-100": location.pathname === "/add-clothes/import"
                })} onClick={() => navigate("/add-clothes/import")}>
                  <Upload className="h-4 w-4" />
                  Importer depuis la Galerie
                </Button>
                <Button variant="ghost" className={cn("w-full justify-start gap-2", {
                  "bg-gray-100": location.pathname === "/add-clothes/manual"
                })} onClick={() => navigate("/add-clothes/manual")}>
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
