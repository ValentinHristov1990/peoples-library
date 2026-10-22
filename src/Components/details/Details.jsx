import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { allBooks } from '../../books-data/allBooks';
import request from '../utils/request';

export default function Details() {
    const { bookId } = useParams();
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBookDetails() {
            const foundInStatic = allBooks.find((item) => item.id === bookId);

            if (foundInStatic) {
                setBook(foundInStatic);
                setLoading(false);
            } else {
                try {
                    const data = await request(`/books?id=eq.${bookId}`);
                    if (data && data.length > 0) {
                        setBook(data[0]);
                    }
                } catch (error) {
                    console.error('Failed to fetch book details:', error);
                } finally {
                    setLoading(false);
                }
            }
        }

        fetchBookDetails();
    }, [bookId]);

    if (loading) {
        return (
            <div className="details-container">
                <h2>Book Details</h2>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="details-container">
            <h2>Book Details</h2>
            {book ? (
                <>
                    <img src={book.imageurl || book.imageUrl} alt={book.title} />
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