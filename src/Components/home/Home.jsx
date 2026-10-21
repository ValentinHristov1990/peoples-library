import { Link } from 'react-router';
import { allBooks } from '../../books-data/allBooks';

export default function Home({ isAuthenticated }) {
    const getDailyTopBooks = (books) => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);

        const startIdx = dayOfYear % books.length;
        const top3 = [];
        for (let i = 0; i < 3; i++) {
            top3.push(books[(startIdx + i) % books.length]);
        }
        return top3;
    };

    const dailyBooks = getDailyTopBooks(allBooks);

    return (
        <section className="hero-container">
            <div className="hero-content">
                <h2>Organize your reading journey!</h2>
                <p>
                    Discover new books, create shelves and keep tracking everything you read in one place.
                </p>
                <div className="hero-buttons">
                    <Link to="/catalog" className="cta-btn primary" style={{ textDecoration: 'none' }}>
                        Explore Catalog
                    </Link>

                    {isAuthenticated ? (
                        <Link to="/shelf" className="cta-btn secondary" style={{ textDecoration: 'none' }}>
                            My Shelf
                        </Link>
                    ) : (
                        <Link to="/login" className="cta-btn secondary" style={{ textDecoration: 'none' }}>
                            Create First Shelf
                        </Link>
                    )}
                </div>

                <div className="hero-daily-section">
                    <h3 className="hero-daily-title">Today's Top 3 Books</h3>
                    <div className="hero-daily-grid">
                        {dailyBooks.map((book) => (
                            <div key={book.id} className="book-card">
                                <div>
                                    <div className="book-img-wrapper">
                                        <img src={book.imageUrl || book.img} alt={book.title} />
                                    </div>
                                    <h3 className="book-title">{book.title}</h3>
                                    <p className="book-author">By: {book.author}</p>
                                    <p className="book-genre">{book.genre}</p>
                                </div>

                                <Link to={`/details/${book.id}`} className="form-btn book-details-btn">
                                    Details
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}