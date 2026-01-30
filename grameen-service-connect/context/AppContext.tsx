import React, {
  createContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { AppContextType, Language } from "../types";
import { User } from "../lib/api";
import { useAuthStore } from "../store/authStore";

export const AppContext = createContext<AppContextType | null>(null);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

  // Use Zustand store for authentication
  const {
    isAuthenticated,
    user,
    login: authLogin,
    logout: authLogout,
  } = useAuthStore();

  const toggleLanguage = useCallback(() => {
    setLanguage((prevLang) => (prevLang === "en" ? "bn" : "en"));
  }, []);

  const login = useCallback(
    (userData: User, token: string) => {
      authLogin(userData, token);
    },
    [authLogin]
  );

  const logout = useCallback(() => {
    authLogout();
  }, [authLogout]);

  return (
    <AppContext.Provider
      value={{ language, toggleLanguage, isAuthenticated, user, login, logout }}
    >
      {children}
    </AppContext.Provider>
  );
};
