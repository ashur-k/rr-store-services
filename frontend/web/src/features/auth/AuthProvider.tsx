import type { ReactNode } from "react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { AuthContext } from "./AuthContext";
import keycloak from "./keycloak";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const initializationStarted = useRef(false);

  useEffect(() => {
    if (initializationStarted.current) {
      return;
    }

    initializationStarted.current = true;

    keycloak
      .init({
        onLoad: "check-sso",
        pkceMethod: "S256",
      })
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Keycloak initialization failed:", error);

        setIsAuthenticated(false);
        setLoading(false);
      });
  }, []);

  const login = useCallback(async () => {
    await keycloak.login({
      redirectUri: `${window.location.origin}/profile`,
    });
  }, []);

  const register = useCallback(async () => {
    await keycloak.register({
      redirectUri: `${window.location.origin}/profile`,
    });
  }, []);

  const logout = useCallback(async () => {
    await keycloak.logout({
      redirectUri: window.location.origin,
    });
  }, []);

  const refreshToken = useCallback(async () => {
    await keycloak.updateToken(-1);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}