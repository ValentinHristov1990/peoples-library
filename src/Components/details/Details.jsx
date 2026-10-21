import { useParams, Link, useNavigate } from 'react-router';
import { allBooks } from '../../books-data/allBooks';

export default function Details() {
    const { bookId } = useParams();
    const book = allBooks.find((item) => item.id === bookId);
    const navigate = useNavigate();

    return (
        <div className="details-container">
            <h2>Book Details</h2>
            {book ? (
                <>
                    <img src={book.imageUrl} alt={book.title} />
                    <h3>Title: {book.title}</h3>
                    <p>Author: {book.author}</p>
                    <p>Genre: {book.genre}</p>
                    <p>Description: {book.description}</p>
                </>
            ) : (
                <p>Book not found.</p>
            )}
            <button onClick={() => navigate(-1)}>Back</button>
        </div>
    );
}