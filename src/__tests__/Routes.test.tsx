import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock all page components to render unique texts so we can verify route rendering.
jest.mock('@/pages/Index', () => () => <div>Index Page</div>);
jest.mock('@/pages/Auth', () => () => <div>Auth Page</div>);
jest.mock('@/pages/AdminLogin', () => () => <div>Admin Login Page</div>);
jest.mock('@/layouts/Admin', () => () => <div>Admin Layout</div>);
jest.mock('@/pages/Search', () => () => <div>Search Page</div>);
jest.mock('@/pages/TrendingOutfits', () => () => <div>Trending Outfits Page</div>);
jest.mock('@/pages/Hashtags', () => () => <div>Hashtags Page</div>);
jest.mock('@/pages/Explore', () => () => <div>Explore Page</div>);
jest.mock('@/pages/Suggestions', () => () => <div>Suggestions Page</div>);
jest.mock('@/pages/Feed', () => () => <div>Feed Page</div>);
jest.mock('@/pages/Challenges', () => () => <div>Challenges Page</div>);
jest.mock('@/pages/Challenge', () => () => <div>Challenge Page</div>);
jest.mock('@/pages/Clothes', () => () => <div>Clothes Page</div>);
jest.mock('@/pages/Outfits', () => () => <div>Outfits Page</div>);
jest.mock('@/pages/Personal', () => () => <div>Personal Page</div>);
jest.mock('@/pages/Community', () => () => <div>Community Page</div>);
jest.mock('@/pages/Groups', () => () => <div>Groups Page</div>);
jest.mock('@/pages/Messages', () => () => <div>Messages Page</div>);
jest.mock('@/pages/Notifications', () => () => <div>Notifications Page</div>);
jest.mock('@/pages/Friends', () => () => <div>Friends Page</div>);
jest.mock('@/pages/FindFriends', () => () => <div>Find Friends Page</div>);
jest.mock('@/pages/Profile', () => () => <div>Profile Page</div>);
jest.mock('@/pages/Settings', () => () => <div>Settings Page</div>);
jest.mock('@/pages/Shops', () => () => <div>Shops Page</div>);
jest.mock('@/pages/CreateShop', () => () => <div>Create Shop Page</div>);
jest.mock('@/pages/StoresList', () => () => <div>Stores List Page</div>);

// For the admin protected route, bypass authentication by rendering children immediately.
jest.mock('@/components/auth/AdminRoute', () => ({
  AdminRoute: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Import the main routing setup from src/main.tsx.
// It is assumed that the primary routes are defined inside an exported component (App).
import App from "@/main";

const createTestApp = (initialEntries: string[]) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("Main Routes", () => {
  // Home section test: should render the Index page for "/"
  it("renders Index Page for route '/'", () => {
    createTestApp(["/"]);
    expect(screen.getByText("Index Page")).toBeInTheDocument();
  });

  // Auth section test: should render the Auth page for "/auth"
  it("renders Auth Page for route '/auth'", () => {
    createTestApp(["/auth"]);
    expect(screen.getByText("Auth Page")).toBeInTheDocument();
  });

  // Admin section test: should render the Admin layout for an admin route.
  it("renders Admin Layout for route '/admin/dashboard'", () => {
    createTestApp(["/admin/dashboard"]);
    expect(screen.getByText("Admin Layout")).toBeInTheDocument();
  });

  // Explore section test: should render the Search page for "/search"
  it("renders Search Page for route '/search'", () => {
    createTestApp(["/search"]);
    expect(screen.getByText("Search Page")).toBeInTheDocument();
  });

  // Personal section test: should render the Personal page for "/personal"
  it("renders Personal Page for route '/personal'", () => {
    createTestApp(["/personal"]);
    expect(screen.getByText("Personal Page")).toBeInTheDocument();
  });

  // Community section test: should render the Community page for "/community"
  it("renders Community Page for route '/community'", () => {
    createTestApp(["/community"]);
    expect(screen.getByText("Community Page")).toBeInTheDocument();
  });

  // Profile section test: should render the Profile page for "/profile"
  it("renders Profile Page for route '/profile'", () => {
    createTestApp(["/profile"]);
    expect(screen.getByText("Profile Page")).toBeInTheDocument();
  });

  // 404 test: should render NotFound for unrecognized routes.
  it("renders NotFound page for an unknown route", () => {
    createTestApp(["/some/unknown/path"]);
    // Since the NotFound page is not explicitly mocked,
    // we check for a text that appears in the default NotFound page.
    // The default NotFound component renders "404" in an h1 element.
    expect(screen.getByText("404")).toBeInTheDocument();
  });
});
