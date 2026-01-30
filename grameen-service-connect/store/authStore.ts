import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../lib/api";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (userData: User, token: string) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        set({ isAuthenticated: true, user: userData, token });
      },
      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ isAuthenticated: false, user: null, token: null });
      },
      setUser: (user: User) => {
        localStorage.setItem("user", JSON.stringify(user));
        set({ user });
      },
    }),
    {
      name: "auth-storage",
      // Rehydrate from localStorage on mount
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
);
