import { NavLink } from 'react-router';
import { useState, useEffect } from 'react';
import useAuth from '../../Components/hooks/useAuth';

export default function Header() {
    const { isAuthenticated, user } = useAuth();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const username = user?.user_metadata?.username || user?.username;
    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) + ' h';

    return (
        <header className="header-container">
            <div className="site-title">
                <h1>People's Library</h1>
                <p>Personal Reading Space</p>
            </div>
            <nav>
                <span className="nav-clock">{formattedTime}</span>

                <NavLink to="/">Home</NavLink>
                <NavLink to="/catalog">Catalog</NavLink>

                {isAuthenticated ? (
                    <div className="user">
                        <NavLink to="/shelf">My Shelf</NavLink>
                        <NavLink to="/my-books">My Books</NavLink>
                        <NavLink to="/create">Add Book</NavLink>
                        <NavLink to="/logout">Logout</NavLink>
                        <span className="welcome">Welcome, {username}</span>
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