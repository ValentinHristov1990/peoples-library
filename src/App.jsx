import { Routes, Route, useNavigate } from "react-router";
import Header from "./Components/header/Header";
import Home from "./Components/home/Home";
import Register from "./Components/register/Register";
import Login from "./Components/login/Login";
import Logout from "./Components/logout/Logout";
import Catalog from "./Components/catalog/Catalog";
import Details from "./Components/details/Details";
import Create from "./Components/create/Create";
import Edit from "./Components/edit/Edit";
import BookShelf from "./Components/shelf/BookShelf";
import Footer from "./Footer";
import "./App.css";
// import { authApi } from "./Components/service/index.js";
import { useState } from "react";
import AuthContext from "./context/authContext.js";
import GuestRoute from "./Components/protected-route/GuestRoute.jsx"
import ProtectedRoute from "./Components/protected-route/ProtectedRoute.jsx";
import usePreventGlobalDrop from "./Components/hooks/usePreventGlobalDrop.jsx";

export default function App() {

  usePreventGlobalDrop();

  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem('auth');
    return savedAuth ? JSON.parse(savedAuth) : null;
  });

  const navigate = useNavigate();

  const register = async (data) => {
    setAuth(data);
    localStorage.setItem('auth', JSON.stringify(data));
    navigate("/shelf");
  }

  const login = async (data) => {
    setAuth(data);
    localStorage.setItem('auth', JSON.stringify(data));
    navigate("/shelf");
  }

  const logoutAction = async () => {
    setAuth(null);
    localStorage.removeItem('auth');
  }

  const contextValue = {
    accessToken: auth?.access_token,
    user: auth?.user,
    isAuthenticated: !!auth,
    register,
    login,
    logout: logoutAction
  }
  return (

    <AuthContext.Provider value={contextValue}>
      <div className="app-layout">
        <Header isAuthenticated={!!auth} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/details/:bookId" element={<Details />} />
            <Route path="/logout" element={<Logout />} />

            <Route element={<GuestRoute />}>
              <Route path="/register" element={<Register onRegister={register} />} />
              <Route path="/login" element={<Login onLogin={login} />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/shelf" element={<BookShelf user={auth?.user} />} />
              <Route path="/create" element={<Create />} />
              <Route path="/edit/:bookId" element={<Edit />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthContext.Provider>
  );
}