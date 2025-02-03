import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';
import Login from "@/pages/Login";
import { BrowserRouter } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Mock the useNavigate hook from react-router-dom and toast hook from the UI library
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

const mockedToast = jest.fn();
jest.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({
    toast: mockedToast,
  }),
}));

// Mock the supabase client auth method
jest.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

// Helper function to render component with routing context
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Login Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders email input, password input, and submit button", () => {
    renderWithRouter(<Login />);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Mot de passe/i);
    const submitButton = screen.getByRole("button", { name: /se connecter/i });
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("handles successful login by calling signInWithPassword and navigating to home", async () => {
    // Simulate a successful login (no error returned)
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({ error: null });

    renderWithRouter(<Login />);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Mot de passe/i);
    const submitButton = screen.getByRole("button", { name: /se connecter/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("shows error toast and does not navigate on invalid credentials", async () => {
    // Simulate a login error from supabase (wrong credentials)
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      error: { message: "Invalid credentials" },
    });

    renderWithRouter(<Login />);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Mot de passe/i);
    const submitButton = screen.getByRole("button", { name: /se connecter/i });

    await userEvent.type(emailInput, "wrong@example.com");
    await userEvent.type(passwordInput, "wrongpassword");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "wrong@example.com",
        password: "wrongpassword",
      });
    });

    await waitFor(() => {
      expect(mockedToast).toHaveBeenCalledWith({
        title: "Erreur de connexion",
        description: "Invalid credentials",
        variant: "destructive",
      });
    });

    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  it("handles submission when inputs are empty and shows appropriate error toast", async () => {
    // Simulate an error when empty values are submitted
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      error: { message: "Missing email or password" },
    });

    renderWithRouter(<Login />);
    const submitButton = screen.getByRole("button", { name: /se connecter/i });

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "",
        password: "",
      });
    });

    await waitFor(() => {
      expect(mockedToast).toHaveBeenCalledWith({
        title: "Erreur de connexion",
        description: "Missing email or password",
        variant: "destructive",
      });
    });

    expect(mockedNavigate).not.toHaveBeenCalled();
  });
});