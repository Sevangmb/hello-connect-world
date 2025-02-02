import React from "react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";

const Help = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto space-y-8">
          <section>
            <h1 className="text-3xl font-bold mb-4">Aide & Support</h1>
            <p className="text-lg text-gray-700">
              Retrouvez ici des réponses aux questions fréquentes ainsi que nos informations de contact pour obtenir un support supplémentaire.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">FAQ</h2>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-xl font-medium">Comment créer un compte ?</h3>
                <p className="mt-2 text-gray-600">
                  Cliquez sur le bouton "S'inscrire" en haut de la page et suivez les instructions pour créer votre compte.
                </p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-xl font-medium">Comment réinitialiser mon mot de passe ?</h3>
                <p className="mt-2 text-gray-600">
                  Cliquez sur "Mot de passe oublié ?" sur la page de connexion et suivez les étapes proposées pour réinitialiser votre mot de passe.
                </p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-xl font-medium">Comment contacter l'assistance ?</h3>
                <p className="mt-2 text-gray-600">
                  Vous pouvez nous contacter via le formulaire de contact disponible dans la section "Contact", ou par email directement.
                </p>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact</h2>
            <div className="bg-white p-4 rounded shadow space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Email :</span> support@hello-connect.com
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Téléphone :</span> +33 1 23 45 67 89
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Adresse :</span> 123 Rue de la Connectivité, Paris, France
              </p>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">Support & Liens Utiles</h2>
            <div className="bg-white p-4 rounded shadow space-y-2">
              <p className="text-gray-600">
                Pour plus d'aide, consultez nos ressources et guides en ligne :
              </p>
              <ul className="list-disc pl-5 text-gray-600">
                <li>
                  <a
                    href="https://www.hello-connect.com/documentation"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.hello-connect.com/forum"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Forum Communautaire
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.hello-connect.com/tutorials"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Tutoriels Vidéo
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Help;
