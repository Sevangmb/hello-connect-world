import { FC } from 'react';
import { Link } from 'react-router-dom';

export const Navbar: FC = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            App
          </Link>
          <div className="flex space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-gray-900">
              Connexion
            </Link>
            <Link to="/register" className="text-gray-600 hover:text-gray-900">
              Inscription
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};