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
import { authApi } from "./Components/service/index.js";
import { useState } from "react";
import AuthContext from "./context/authContext.js";

export default function App() {
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();

  const register = async (userData) => {
    const data = await authApi.register(userData);
    setAuth(data);
    navigate("/shelf");
  }

  const login = async (userData) => {
    const data = await authApi.login(userData);
    setAuth(data);
    navigate("/shelf");
  }

  const logoutAction = async () => {
    try {
      await authApi.logout(auth?.access_token);
      setAuth(null);
      navigate("/");
    } catch (error) {
      alert(error.message)
    }
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
            <Route path="/register" element={<Register onRegister={register} />} />
            <Route path="/login" element={<Login onLogin={login} />} />
            <Route path="/shelf" element={<BookShelf />} />
            <Route path="/create" element={<Create />} />
            <Route path="/edit/:bookId" element={<Edit />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/details/:bookId" element={<Details />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthContext.Provider>
  );
}