
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface FooterProps {
  show?: boolean;
  className?: string;
}

export function Footer({ show = false, className }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  if (!show) return null;
  
  // Organisation en sections claires
  const footerSections = [
    {
      title: "FRING!",
      content: "Votre assistant mode personnel pour gérer votre garde-robe et découvrir des tenues adaptées à chaque occasion.",
      links: []
    },
    {
      title: "Navigation",
      content: "",
      links: [
        { label: "Accueil", path: "/" },
        { label: "Explorer", path: "/explore" },
        { label: "Mon Univers", path: "/personal" },
        { label: "Boutiques", path: "/boutiques" }
      ]
    },
    {
      title: "Mon Compte",
      content: "",
      links: [
        { label: "Profil", path: "/profile" },
        { label: "Garde-robe", path: "/personal/wardrobe" },
        { label: "Mes Tenues", path: "/personal/outfits" },
        { label: "Paramètres", path: "/profile/settings" }
      ]
    },
    {
      title: "Support",
      content: "",
      links: [
        { label: "Contact", path: "/contact" },
        { label: "Aide & Support", path: "/help" },
        { label: "Politique de confidentialité", path: "/privacy" },
        { label: "Conditions d'utilisation", path: "/terms" }
      ]
    }
  ];
  
  return (
    <footer className={cn("bg-gray-100 py-6 border-t mt-auto", className)}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              {section.content && <p className="text-sm text-gray-600 mb-4">{section.content}</p>}
              {section.links.length > 0 && (
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link to={link.path} className="text-sm text-gray-600 hover:text-primary">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} FRING! - Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
}
