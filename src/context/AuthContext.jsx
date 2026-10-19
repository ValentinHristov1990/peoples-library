import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../Components/service";

const AuthContext = createContext({
  accessToken: "",
  user: null,
  isAuthenticated: false,
  register: () => { },
  login: () => { },
  logout: () => { },
});

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [authState, setAuthState] = useState(() => {
    const savedAuth = localStorage.getItem("auth");
    return savedAuth ? JSON.parse(savedAuth) : { accessToken: "", user: null };
  });

  const setAuthData = (data) => {
    setAuthState(data);
    if (data.accessToken) {
      localStorage.setItem("auth", JSON.stringify(data));
    } else {
      localStorage.removeItem("auth");
    }
  };

  const loginHandler = async (formData) => {
    try {
      const result = await authApi.login(formData);
      setAuthData({
        accessToken: result.access_token,
        user: result.user,
      });
      navigate("/shelf");
      return result;
    } catch (error) {
      alert(`Login failed: ${error.message}`);
      throw error;
    }
  };

  const registerHandler = async (formData) => {
    try {
      const result = await authApi.register(formData);

      if (result.access_token) {
        setAuthData({
          accessToken: result.access_token,
          user: result.user,
        });
        navigate("/shelf");
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  const logoutHandler = async () => {
    try {
      if (authState.accessToken) {
        await authApi.logout(authState.accessToken);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAuthData({ accessToken: "", user: null });
      navigate("/");
    }
  };

  const contextValues = {
    accessToken: authState.accessToken,
    user: authState.user,
    isAuthenticated: !!authState.accessToken,
    register: registerHandler,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValues}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
