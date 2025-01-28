import { FC } from 'react';

export const Footer: FC = () => {
  return (
    <footer className="bg-white shadow-sm mt-8">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-gray-600">
          © {new Date().getFullYear()} App. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};