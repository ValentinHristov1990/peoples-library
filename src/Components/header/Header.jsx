import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

                <Link to="/">Home</Link>
                <Link to="/catalog">Books Catalog</Link>

                {isAuthenticated ? (
                    <div className="user">
                        <Link to="/create">Create Shelf</Link>
                        <Link to="/logout">Logout</Link>
                        {isAuthenticated && user?.username && (
                            <div className="welcome">
                                <span>Welcome, {user.username}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="guest">
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </div>
                )}

            </nav>

        </header>
    );
}