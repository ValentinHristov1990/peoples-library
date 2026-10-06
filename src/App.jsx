import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Components/header/Header";
import Home from "./Components/home/Home";
import Register from "./Components/register/Register";
import Footer from "./Footer";
import "./App.css";
import Login from "./Components/login/Login";
import NotFound from "./Components/not-found/NotFound";
import Create from "./Components/create/Create";

export default function App() {
  return (
    <div className="app-layout">
      <BrowserRouter>
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create" element={<Create />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </BrowserRouter>
    </div>
  );
}
