import { Link, useSearchParams } from 'react-router-dom';
import { fantasyBooks } from '../../books-data/fantasy';
import { personalDevelopmentBooks } from '../../books-data/personalDevelopmentBooks';
import { mysteryBooks } from '../../books-data/mystery';
import { classicsBooks } from '../../books-data/classics';
import { techBooks } from '../../books-data/tech';
import { historyBooks } from '../../books-data/history';

const GENRES = [
    { id: 'all', name: 'All Books' },
    { id: 'fantasy', name: 'Fantasy & Sci-Fi' },
    { id: 'personal-development', name: 'Personal Development' },
    { id: 'mystery', name: 'Mystery & Thriller' },
    { id: 'classics', name: 'Classics & Literature' },
    { id: 'tech', name: 'Tech & Programming' },
    { id: 'history', name: 'History & Biography' },
];

const allBooks = [
    ...fantasyBooks,
    ...personalDevelopmentBooks,
    ...mysteryBooks,
    ...classicsBooks,
    ...techBooks,
    ...historyBooks,
];

const booksMap = {
    'all': allBooks,
    'fantasy': fantasyBooks,
    'personal-development': personalDevelopmentBooks,
    'mystery': mysteryBooks,
    'classics': classicsBooks,
    'tech': techBooks,
    'history': historyBooks,
};

export default function Catalog() {
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedGenre = searchParams.get('genre') || 'all';
    const searchQuery = searchParams.get('search') || '';
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const booksPerPage = 5;

    const books = booksMap[selectedGenre] || allBooks;

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


    const updateParams = (newParams) => {
        setSearchParams({
            genre: selectedGenre,
            search: searchQuery,
            page: currentPage,
            ...newParams,
        });
    };

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
                )}
            </div>
        </section>
    );
}