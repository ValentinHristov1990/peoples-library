import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="header-container">
            <div className="site-title">
                <h1>People's Library</h1>
                <p>Your personal digital bookshelf and catalog</p>
            </div>

            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/catalog">Books Catalog</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/create">Create Shelf</Link></li>
                </ul>
            </nav>
        </header>
    );
}