import { NavLink } from 'react-router';

export default function Header({ isAuthenticated, user }) {


    return (
        <header className="header-container">
            <div className="site-title">
                <h1>People's Library</h1>
                <p>Personal Reading Space</p>
            </div>
            <nav>
                <NavLink to="/">
                    Home
                </NavLink>

                <NavLink to="/catalog">
                    Catalog
                </NavLink>

                {isAuthenticated ? (
                    <div className="user">
                        <NavLink to="/shelf">
                            My Shelf
                        </NavLink>
                        <NavLink to="/create">
                            Add Book
                        </NavLink>
                        <NavLink to="/logout">
                            Logout
                        </NavLink>
                        <span className="welcome">Welcome, {user?.username}</span>
                    </div>
                ) : (
                    <div className="guest">
                        <NavLink to="/login">
                            Login
                        </NavLink>
                        <NavLink to="/register">
                            Register
                        </NavLink>
                    </div>
                )}
            </nav>
        </header>
    );
}