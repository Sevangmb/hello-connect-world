import { Home, Users, Bookmark, Settings } from "lucide-react";

const menuItems = [
  { icon: Home, label: "Accueil", path: "/" },
  { icon: Users, label: "Amis", path: "/friends" },
  { icon: Bookmark, label: "Sauvegardés", path: "/saved" },
  { icon: Settings, label: "Paramètres", path: "/settings" },
];

export const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col gap-2 p-4 fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 bg-white">
      {menuItems.map((item) => (
        <a
          key={item.path}
          href={item.path}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <item.icon className="h-6 w-6 text-facebook-primary" />
          <span className="text-gray-700 font-medium">{item.label}</span>
        </a>
      ))}
    </aside>
  );
};