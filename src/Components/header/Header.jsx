import { Link } from "react-router-dom";

export default function Header({
    isAuthenticated,
    user,
}) {
    return (
        <header className="header-container">
            <div className="site-title">
                <h1>People's Library</h1>
                <p>Your personal digital bookshelf and catalog</p>
            </div>

            <nav>
                <Link to="/">Home</Link>
                <Link to="/catalog">Books Catalog</Link>

                {isAuthenticated ? (
                    <div className="user">
                        <Link to="/create">Create Shelf</Link>
                        <Link to="/logout">Logout</Link>
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