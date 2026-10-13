import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        setIsAuthenticated(false);
        alert("Logged out successfully!");
    };

    return (
        <header className="header-container">
            <div className="site-title">
                <h1>People's Library</h1>
                <p>Your personal digital bookshelf and catalog</p>
            </div>

            <nav>
                <ul>
                    <li><NavLink to="/" end>Home</NavLink></li>
                    <li><NavLink to="/catalog">Books Catalog</NavLink></li>
                    <li><NavLink to="/create">Create Shelf</NavLink></li>
                    <li><NavLink to="/logout">Logout</NavLink></li>

                    {!isAuthenticated ? (
                        <>
                            <li><NavLink to="/login">Login</NavLink></li>
                            <li><NavLink to="/register">Register</NavLink></li>
                        </>
                    ) : (
                        <li>
                            <a href="#logout" onClick={handleLogout}>Logout</a>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}