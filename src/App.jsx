import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Header0 from "./Components/header/Header";
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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-layout">
          <Header0 />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
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
      </AuthProvider>
    </BrowserRouter>
  );
}