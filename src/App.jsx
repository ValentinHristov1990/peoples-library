import { Routes, Route } from "react-router";
import Header from "./Components/header/Header";
import Home from "./Components/home/Home";
import Register from "./Components/register/Register";
import Login from "./Components/login/Login";
import Logout from "./Components/logout/Logout";
import Catalog from "./Components/catalog/Catalog";
import Details from "./Components/details/Details";
import Create from "./Components/create/Create";
import Edit from "./Components/edit/Edit";
import BookShelf from "./Components/shelf/BookShelf.jsx";
import Footer from "./Footer";
import "./App.css";
import GuestRoute from "./Components/protected-route/GuestRoute.jsx";
import ProtectedRoute from "./Components/protected-route/ProtectedRoute.jsx";
import usePreventGlobalDrop from './hooks/usePreventGlobalDrop';
import MyBooks from "./Components/my-books/MyBooks.jsx";
import { AuthProvider } from "./context/authContext.jsx";
import { ShelfProvider } from "./context/shelf-context/ShelfContext.jsx";

export default function App() {

  usePreventGlobalDrop();

  return (

    <AuthProvider>
      <ShelfProvider>
        <div className="app-layout">

          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/details/:bookId" element={<Details />} />
              <Route path="/logout" element={<Logout />} />

              <Route element={<GuestRoute />}>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/shelf" element={<BookShelf />} />
                <Route path="/create" element={<Create />} />
                <Route path="/my-books" element={<MyBooks />} />
                <Route path="/edit/:bookId" element={<Edit />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </ShelfProvider>
    </AuthProvider>
  );
}