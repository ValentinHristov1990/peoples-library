import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Header({
    isAuthenticated,
    user,
}) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <header className="header-container">
            <div className="site-title">
                <h1>People's Library</h1>
                <p>Your personal digital bookshelf and catalog</p>
            </div>


            <nav>
                <span className="nav-clock">
                    {time.toLocaleTimeString('en-BG', { hour12: false })}
                </span>

                <NavLink to="/">Home</NavLink>
                <NavLink to="/catalog">Books Catalog</NavLink>

                {isAuthenticated ? (
                    <div className="user">
                        <NavLink to="/create">Create Book</NavLink>
                        <NavLink to="/logout">Logout</NavLink>
                        <NavLink to="/shelf">Your Shelf</NavLink>
                        {isAuthenticated && user?.username && (
                            <div className="welcome">
                                <span>Welcome, {user.username}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="guest">
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/register">Register</NavLink>
                    </div>
                )}

            </nav>

        </header>
    );
}