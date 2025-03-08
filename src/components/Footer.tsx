
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface FooterProps {
  show?: boolean;
  className?: string;
}

export function Footer({ show = false, className }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  if (!show) return null;
  
  return (
    <footer className={cn("bg-gray-100 py-6 border-t mt-auto", className)}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">FRING!</h3>
            <p className="text-sm text-gray-600">
              Votre assistant mode personnel pour gérer votre garde-robe 
              et découvrir des tenues adaptées à chaque occasion.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-primary">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-sm text-gray-600 hover:text-primary">
                  Explorer
                </Link>
              </li>
              <li>
                <Link to="/personal" className="text-sm text-gray-600 hover:text-primary">
                  Mon Univers
                </Link>
              </li>
              <li>
                <Link to="/friends" className="text-sm text-gray-600 hover:text-primary">
                  Social
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-sm text-gray-600 hover:text-primary">
                  Aide & Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-primary">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-primary">
                  Conditions d'utilisation
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} FRING! - Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
}
