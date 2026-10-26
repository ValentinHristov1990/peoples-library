import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import request from '../utils/request';
import LoadingSpinner from '../common/LoadingSpinner';
import useAuth from "../../hooks/useAuth"

export default function Home() {
    const { isAuthenticated } = useAuth();
    const [dailyBooks, setDailyBooks] = useState([]);
    const [isLoadingDailyBooks, setIsLoadingDailyBooks] = useState(true);

    useEffect(() => {
        async function fetchDailyBooks() {
            try {
                const data = await request('/books?select=id,title,author,genre,imageUrl');
                if (data && data.length > 0) {
                    const shuffled = [...data].sort(() => 0.5 - Math.random());
                    setDailyBooks(shuffled.slice(0, 3));
                }
            } catch (error) {
                console.error('Failed to fetch top books:', error);
            } finally {
                setIsLoadingDailyBooks(false);
            }
        }
        fetchDailyBooks();
    }, []);

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
                    {isLoadingDailyBooks ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="hero-daily-grid">
                            {dailyBooks.map((book) => (
                                <div key={book.id || book._id} className="book-card">
                                    <div>
                                        <div className="book-img-wrapper">
                                            <img src={book.imageUrl || book.imageurl} alt={book.title} />
                                        </div>
                                        <h3 className="book-title">{book.title}</h3>
                                        <p className="book-author">By: {book.author}</p>
                                        <p className="book-genre">{book.genre}</p>
                                    </div>

                                    <Link to={`/details/${book.id || book._id}`} className="form-btn book-details-btn">
                                        Details
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}