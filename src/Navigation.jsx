export default function Nav() {
    return (
        <div className="nav-container">
            <header>

                <div className="site-title">
                    <h1>People's Library</h1>
                    <p>Your personal digital bookshelf and catalog</p>
                </div>

                <nav>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/dashboard">Books Catalog</a></li>
                        <li><a href="/login">Login</a></li>
                        <li><a href="/register">Register</a></li>
                        <li><a href="/create">Create Shelf</a></li>
                        <li><a href="/edit">Edit Shelf</a></li>
                        <li><a href="/delete">Delete Shelf</a></li>
                    </ul>
                </nav>
            </header>
        </div>
    );
}