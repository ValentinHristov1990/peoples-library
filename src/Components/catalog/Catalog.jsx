import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fantasyBooks } from '../../books-data/fantasy';

const GENRES = [
    { id: 'fantasy', name: 'Fantasy & Sci-Fi' }
];

export default function Catalog() {
    const [selectedGenre, setSelectedGenre] = useState('fantasy');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 5;

    const books = selectedGenre === 'fantasy' ? fantasyBooks : [];

    const filteredBooks = books.filter((book) => {
        const title = book.title?.toLowerCase() || '';
        const author = book.author?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();
        return title.includes(query) || author.includes(query);
    });

    const totalPages = Math.ceil(filteredBooks.length / booksPerPage) || 1;
    const safeCurrentPage = currentPage > totalPages ? 1 : currentPage;

    const currentBooks = filteredBooks.slice(
        (safeCurrentPage - 1) * booksPerPage,
        safeCurrentPage * booksPerPage
    );

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
                                setSelectedGenre(e.target.value);
                                setCurrentPage(1);
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
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="form-input"
                        />
                    </div>
                </div>

                <div className="books-grid">
                    {currentBooks.length > 0 ? (
                        currentBooks.map((book) => (
                            <div key={book.id} className="book-card">
                                <div>
                                    <div className="book-img-wrapper">
                                        <img src={book.imageUrl} alt={book.title} />
                                    </div>
                                    <h3 className="book-title">{book.title}</h3>
                                    <p className="book-author">By: {book.author}</p>
                                    <p className="book-genre">{book.genre}</p>
                                </div>

                                <Link to={`/catalog/${book.id}`} className="form-btn book-details-btn">
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

                {totalPages > 1 && (
                    <div className="catalog-pagination">
                        <button
                            className={`form-btn pagination-btn ${safeCurrentPage === 1 ? 'disabled' : ''}`}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={safeCurrentPage === 1}
                        >
                            &larr; Prev
                        </button>

                        <span className="pagination-info">
                            Page {safeCurrentPage} of {totalPages}
                        </span>

                        <button
                            className={`form-btn pagination-btn ${safeCurrentPage === totalPages ? 'disabled' : ''}`}
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={safeCurrentPage === totalPages}
                        >
                            Next &rarr;
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}