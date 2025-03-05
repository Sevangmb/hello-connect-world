
/**
 * Point d'entrée principal pour tous les modules de l'application
 * Facilite l'import des modules dans le code
 */

// Importer et réexporter tous les modules
import * as AdminModule from './admin';
import * as AuthModule from './auth';
import * as CartModule from './cart';
import * as ChallengesModule from './challenges';
import * as ClothesModule from './clothes';
import * as CoreModule from './core';
import * as FriendsModule from './friends';
import * as GroupsModule from './groups';
import * as HashtagsModule from './hashtags';
import * as HomeModule from './home';
import * as LandingModule from './landing';
import * as MessagesModule from './messages';
import * as NavigationModule from './navigation';
import * as NotificationsModule from './notifications';
import * as OutfitsModule from './outfits';
import * as PostsModule from './posts';
import * as ProfileModule from './profile';
import * as SearchModule from './search';
import * as SettingsModule from './settings';
import * as ShopModule from './shop';
import * as StoresModule from './stores';
import * as SuitcasesModule from './suitcases';
import * as UsersModule from './users';
import * as VirtualDressingModule from './virtual-dressing';

// Exporter tous les modules
export const Admin = AdminModule;
export const Auth = AuthModule;
export const Cart = CartModule;
export const Challenges = ChallengesModule;
export const Clothes = ClothesModule;
export const Core = CoreModule;
export const Friends = FriendsModule;
export const Groups = GroupsModule;
export const Hashtags = HashtagsModule;
export const Home = HomeModule;
export const Landing = LandingModule;
export const Messages = MessagesModule;
export const Navigation = NavigationModule;
export const Notifications = NotificationsModule;
export const Outfits = OutfitsModule;
export const Posts = PostsModule;
export const Profile = ProfileModule;
export const Search = SearchModule;
export const Settings = SettingsModule;
export const Shop = ShopModule;
export const Stores = StoresModule;
export const Suitcases = SuitcasesModule;
export const Users = UsersModule;
export const VirtualDressing = VirtualDressingModule;

// Exporter la registry de modules
export * from './ModuleRegistry';
