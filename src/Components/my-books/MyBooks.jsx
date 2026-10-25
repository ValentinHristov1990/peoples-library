import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import request from '../utils/request';
import './myBooksStyle.css';
import useAuth from '../../hooks/useAuth';

export default function MyBooks() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [myBooks, setMyBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMyBooks() {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                const data = await request(`/books?user_id=eq.${user.id}`);
                setMyBooks(data ? data.reverse() : []);
            } catch (error) {
                console.error('Failed to fetch my books:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchMyBooks();
    }, [user?.id]);

    if (loading) {
        return (
            <section className="form-container">
                <div className="form-card form-card-wide catalog-card-wide">
                    <h2 className="form-title">My Books</h2>
                    <p className="catalog-no-books">Loading your books...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="form-container">
            <div className="form-card form-card-wide catalog-card-wide">
                <h2 className="form-title">My Books</h2>

                {myBooks.length > 0 ? (
                    <div className="books-grid">
                        {myBooks.map((book) => (
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
                ) : (
                    <div className="my-books-empty-container">
                        <p className="catalog-no-books my-books-empty-text">
                            No{' '}
                            <button
                                onClick={() => navigate('/create')}
                                className="form-btn my-books-created-btn"
                            >
                                created
                            </button>{' '}
                            books yet.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}