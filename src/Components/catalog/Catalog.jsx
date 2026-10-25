import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import request from '../utils/request';
import LoadingSpinner from '../common/LoadingSpinner';
import useLoading from '../../hooks/useLoading';

const GENRES = [
    { id: 'all', name: 'All Books' },
    { id: 'Fantasy & Sci-Fi', name: 'Fantasy & Sci-Fi' },
    { id: 'Personal Development', name: 'Personal Development' },
    { id: 'Mystery & Thriller', name: 'Mystery & Thriller' },
    { id: 'Classics & Literature', name: 'Classics & Literature' },
    { id: 'Tech & Programming', name: 'Tech & Programming' },
    { id: 'History & Biography', name: 'History & Biography' },
    { id: 'Geography & Travel', name: 'Geography & Travel' },
];

export default function Catalog() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [dbBooks, setDbBooks] = useState([]);
    const { loading, isLoading } = useLoading();
    const selectedGenre = searchParams.get('genre') || 'all';
    const searchQuery = searchParams.get('search') || '';
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const booksPerPage = 10;

    useEffect(() => {
        async function fetchBooks() {
            try {
                await isLoading(async () => {
                    const data = await request('/books');
                    setDbBooks(data ? [...data].reverse() : []);
                })
            } catch (error) {
                console.error('Failed to fetch books:', error);
            }
        }
        fetchBooks();
    }, []);

    const filteredBooks = dbBooks.filter(book => {
        const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
        const title = book.title?.toLowerCase() || '';
        const author = book.author?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();
        const matchesQuery = title.includes(query) || author.includes(query);
        return matchesGenre && matchesQuery;
    });

    const totalPages = Math.ceil(filteredBooks.length / booksPerPage) || 1;
    const safeCurrentPage = currentPage > totalPages ? 1 : currentPage;

    const currentBooks = filteredBooks.slice(
        (safeCurrentPage - 1) * booksPerPage,
        safeCurrentPage * booksPerPage
    );

    const updateParams = (newParams) => {
        setSearchParams({
            genre: selectedGenre,
            search: searchQuery,
            page: currentPage,
            ...newParams,
        });
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <section className="form-container">
            <div className="form-card form-card-wide catalog-card-wide">
                <h2 className="form-title">Books Catalog</h2>

                <div className="catalog-controls-inline">
                    <div className="form-group inline-group">
                        <label className="form-label">Genre</label>
                        <select
                            className="form-input"
                            value={selectedGenre}
                            onChange={(e) => {
                                updateParams({ genre: e.target.value, page: 1 });
                            }}
                        >
                            {GENRES.map((genre) => (
                                <option key={genre.id} value={genre.id}>
                                    {genre.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group inline-group search-group">
                        <label className="form-label">Search</label>
                        <input
                            type="text"
                            placeholder="Search by title or author..."
                            value={searchQuery}
                            onChange={(e) => {
                                updateParams({ search: e.target.value, page: 1 });
                            }}
                            className="form-input"
                        />
                    </div>
                </div>

                <div className="books-grid">
                    {currentBooks.length > 0 ? (
                        currentBooks.map((book) => (
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
                        ))
                    ) : (
                        <p className="catalog-no-books">
                            No books found matching your criteria.
                        </p>
                    )}
                </div>

                <div className="catalog-pagination">
                    <button
                        className={`form-btn pagination-btn ${safeCurrentPage === 1 ? 'disabled' : ''}`}
                        onClick={() => updateParams({ page: Math.max(safeCurrentPage - 1, 1) })}
                        disabled={safeCurrentPage === 1}
                    >
                        &larr; Prev
                    </button>

                    <span className="pagination-info">
                        Page {safeCurrentPage} of {totalPages}
                    </span>

                    <button
                        className={`form-btn pagination-btn ${safeCurrentPage === totalPages ? 'disabled' : ''}`}
                        onClick={() => updateParams({ page: Math.min(safeCurrentPage + 1, totalPages) })}
                        disabled={safeCurrentPage === totalPages}
                    >
                        Next &rarr;
                    </button>
                </div>
            </div>
        </section>
    );
}