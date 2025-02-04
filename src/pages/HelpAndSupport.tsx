import React from "react";

export default function HelpAndSupport() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      {/* Title Header */}
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-2">FRING! - Aide & Support</h1>
        <p className="text-lg text-gray-700">
          Votre centre d'assistance pour optimiser l'utilisation de l'application FRING!
        </p>
      </header>

      {/* Objectif Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Objectif</h2>
        <p className="text-gray-700">
          Fournir aux utilisateurs (et aux boutiques partenaires) les informations et les ressources nécessaires pour utiliser
          l'application, répondre à leurs questions et résoudre les problèmes rencontrés.
        </p>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">FAQ (Foire Aux Questions)</h2>

        {/* Prise en Main */}
        <article className="mb-6">
          <h3 className="text-xl font-medium mb-2">Prise en Main</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Comment créer un compte sur FRING! ?</li>
            <li>Comment ajouter des vêtements à ma garde-robe ?</li>
            <li>Comment créer une tenue ?</li>
            <li>Comment fonctionne le scan d'étiquette ?</li>
            <li>Comment utiliser les filtres de recherche ?</li>
          </ul>
        </article>

        {/* Fonctionnalités */}
        <article className="mb-6">
          <h3 className="text-xl font-medium mb-2">Fonctionnalités</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Comment fonctionne le système de vote ?</li>
            <li>Comment envoyer un message privé ?</li>
            <li>Comment créer ou rejoindre un groupe ?</li>
            <li>Comment organiser ma garde-robe ?</li>
            <li>Comment utiliser la fonction "Valise" ?</li>
            <li>Comment fonctionnent les défis ?</li>
          </ul>
        </article>

        {/* Vide-Dressing */}
        <article className="mb-6">
          <h3 className="text-xl font-medium mb-2">Vide-Dressing</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Comment mettre un article en vente ?</li>
            <li>Quels sont les frais de commission ?</li>
            <li>Comment se passe la remise en main propre ?</li>
            <li>Que faire en cas de litige ?</li>
            <li>Comment sont sécurisés les paiements ?</li>
          </ul>
        </article>

        {/* Boutiques */}
        <article className="mb-6">
          <h3 className="text-xl font-medium mb-2">Boutiques</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Comment trouver des boutiques près de chez moi ?</li>
            <li>Comment fonctionnent les vitrines virtuelles ?</li>
            <li>Comment contacter une boutique ?</li>
            <li>Comment m'inscrire en tant que boutique partenaire ?</li>
          </ul>
        </article>

        {/* Compte et Sécurité */}
        <article className="mb-6">
          <h3 className="text-xl font-medium mb-2">Compte et Sécurité</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Comment modifier mon profil ?</li>
            <li>Comment changer mon mot de passe ?</li>
            <li>Que faire si j'ai oublié mon mot de passe ?</li>
            <li>Comment gérer mes paramètres de confidentialité ?</li>
            <li>Comment signaler un utilisateur ou un contenu inapproprié ?</li>
          </ul>
        </article>

        {/* Abonnement Premium */}
        <article className="mb-6">
          <h3 className="text-xl font-medium mb-2">Abonnement Premium</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Quels sont les avantages de l'abonnement Premium ?</li>
            <li>Comment m'abonner ou me désabonner ?</li>
            <li>Comment gérer mon abonnement ?</li>
          </ul>
        </article>

        {/* Problèmes Techniques */}
        <article>
          <h3 className="text-xl font-medium mb-2">Problèmes Techniques</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Que faire si l'application ne fonctionne pas correctement ?</li>
            <li>Comment signaler un bug ?</li>
          </ul>
        </article>
      </section>

      {/* Guides et Tutoriels Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Guides et Tutoriels</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Guide de démarrage rapide pour les nouveaux utilisateurs</li>
          <li>Tutoriels sur les fonctionnalités clés : ajout de vêtements, création de tenues, utilisation du vide-dressing, interaction avec les boutiques, etc.</li>
          <li>Astuces et conseils pour optimiser l'utilisation de l'application et découvrir des fonctionnalités moins connues</li>
          <li>Guide pour les boutiques partenaires : création de profil, gestion de la vitrine virtuelle, interaction avec les utilisateurs, etc.</li>
        </ul>
      </section>

      {/* Contacter le Support Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Contacter le Support</h2>
        <div className="text-gray-700 space-y-2">
          <p>
            Utilisez notre formulaire de contact pour soumettre une demande d'assistance en choisissant un motif
            (problème technique, question sur une fonctionnalité, problème avec une transaction, etc.) et en fournissant une description détaillée du problème.
          </p>
          <p>
            Vous pouvez également nous écrire directement à l'adresse email dédiée :{" "}
            <a href="mailto:support@fringapp.com" className="text-blue-600 underline">
              support@fringapp.com
            </a>
          </p>
          <p>
            Chat en direct et assistance téléphonique (pour les demandes urgentes) sont disponibles selon les ressources
            disponibles.
          </p>
        </div>
      </section>

      {/* À propos de FRING! Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">À propos de FRING!</h2>
        <p className="text-gray-700">
          Découvrez notre équipe, l'histoire de l'entreprise et toutes les informations légales en rapport avec FRING!.
          Nous mettons un point d'honneur à offrir transparence et fiabilité à nos utilisateurs.
        </p>
      </section>

      {/* Lien vers les Réseaux Sociaux Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Réseaux Sociaux</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-blue-600 underline">
              Facebook
            </a>
          </li>
          <li>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-blue-600 underline">
              Twitter
            </a>
          </li>
          <li>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-blue-600 underline">
              Instagram
            </a>
          </li>
        </ul>
      </section>

      {/* État du Service Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">État du Service</h2>
        <p className="text-gray-700">
          Consultez en temps réel l'état du service pour être informé(e) en cas de maintenance planifiée ou de problème technique affectant l'application.
          Vous pouvez également accéder à l'historique des incidents et leur résolution.
        </p>
      </section>
    </main>
  );
}
