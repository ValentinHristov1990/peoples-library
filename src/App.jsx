import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Header from "./Components/header/Header";
import Home from "./Components/home/Home";
import Register from "./Components/register/Register";
import Footer from "./Footer";
import "./App.css";
import Login from "./Components/login/Login";
import Create from "./Components/create/Create";
import Catalog from "./Components/catalog/Catalog";
import Details from "./Components/details/Details";
import { useState } from "react";
import Logout from "./Components/logout/Logout";
import BookShelf from "./Components/shelf/BookShelf";

export default function App() {

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  // const navigate = useNavigate();

  const UserHandler = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  const logoutAction = () => {
    setUser(null);
    localStorage.removeItem("user");
  }

  return (
    <div className="app-layout">
      <BrowserRouter>
        <Header isAuthenticated={!!user} user={user} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register onRegister={UserHandler} />} />
            <Route path="/login" element={<Login onLogin={UserHandler} />} />
            <Route path="/shelf" element={<BookShelf user={user} />} />
            <Route path="/create" element={<Create />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/details/:bookId" element={<Details />} />
            <Route path="/logout" element={<Logout onLogout={logoutAction} />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
