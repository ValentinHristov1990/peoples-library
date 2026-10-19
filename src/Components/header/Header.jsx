import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
    const { isAuthenticated, user } = useAuth();

    return (
        <header className="header-container">
            <div className="site-title">
                <h1>People's Library</h1>
                <p>Personal Reading Space</p>
            </div>
            <nav>
                <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                    Home
                </NavLink>

                <NavLink to="/catalog" className={({ isActive }) => (isActive ? 'active' : '')}>
                    Catalog
                </NavLink>

                {isAuthenticated ? (
                    <div className="user">
                        <NavLink to="/shelf" className={({ isActive }) => (isActive ? 'active' : '')}>
                            My Shelf
                        </NavLink>
                        <NavLink to="/create" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Add Book
                        </NavLink>
                        <NavLink to="/logout" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Logout
                        </NavLink>
                        <span className="welcome">Welcome, {user?.email}</span>
                    </div>
                ) : (
                    <div className="guest">
                        <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Login
                        </NavLink>
                        <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Register
                        </NavLink>
                    </div>
                )}
            </nav>
        </header>
    );
}