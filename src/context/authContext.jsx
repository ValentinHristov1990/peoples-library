import { createContext, useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router";

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
    const savedAuth = localStorage.getItem("auth");
    return savedAuth ? JSON.parse(savedAuth) : null;
  });

  const navigate = useNavigate();

  const register = async (data) => {
    setAuth(data);
    localStorage.setItem("auth", JSON.stringify(data));
    navigate("/shelf");
  };

  const login = async (data) => {
    setAuth(data);
    localStorage.setItem("auth", JSON.stringify(data));
    navigate("/shelf");
  };

  const logoutAction = async () => {
    setAuth(null);
    localStorage.removeItem("auth");
  };

  const contextValue = useMemo(
    () => ({
      accessToken: auth?.access_token,
      user: auth?.user,
      isAuthenticated: !!auth,
      register,
      login,
      logout: logoutAction,
    }),
    [auth],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  return useContext(AuthContext);
}
export default AuthContext;
