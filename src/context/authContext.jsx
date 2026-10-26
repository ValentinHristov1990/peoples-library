import { createContext, useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { authRequest } from "../Components/utils/request";

const AuthContext = createContext({
  accessToken: "",
  user: {},
  isAuthenticated: false,
  register() { },
  login() { },
  logout() { },
});

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const savedAuth = localStorage.getItem("auth");
      if (!savedAuth) return null;

      const parsedAuth = JSON.parse(savedAuth);
      if (!parsedAuth) {
        localStorage.removeItem("auth");
        return null;
      }

      return parsedAuth;
    } catch {

      localStorage.removeItem("auth");
      return null;
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    const handleSessionExpired = () => {
      setAuth(null);
      navigate("/login", { replace: true });
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, [navigate]);

  const register = useCallback(async (data) => {
    setAuth(data);
    localStorage.setItem("auth", JSON.stringify(data));
    navigate("/shelf");
  }, [navigate]);

  const login = useCallback(async (data) => {
    setAuth(data);
    localStorage.setItem("auth", JSON.stringify(data));
    navigate("/shelf");
  }, [navigate]);

  const logoutAction = useCallback(async () => {
    try {
      await authRequest('/logout', 'POST');
    } catch (error) {
      console.error("Logout request failed:", error.message);
    } finally {
      setAuth(null);
      localStorage.removeItem("auth");
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      accessToken: auth?.access_token,
      user: auth?.user,
      isAuthenticated: !!auth,
      register,
      login,
      logout: logoutAction,
    }),
    [auth, login, logoutAction, register],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export default AuthContext;
