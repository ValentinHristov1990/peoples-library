import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import request from '../utils/request';
import ConfirmModal from '../shelf/confirm-modal/ConfirmModal';
import { useNotification } from '../notifications/Notification';
import useAuth from '../../hooks/useAuth';
import useLoading from '../../hooks/useLoading';
import LoadingSpinner from '../common/LoadingSpinner';

export default function Details() {
    const { loading, isLoading } = useLoading()
    const { bookId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth()
    const { showNotification } = useNotification();

    const [book, setBook] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        isLoading(async () => {
            try {
                const data = await request(`/books?id=eq.${bookId}`);
                if (data && data.length > 0) {
                    setBook(data[0]);
                }
            } catch (error) {
                showNotification(`Failed to load book details: ${error.message}`, 'error');
            }
        });
    }, [bookId]);

    const confirmDelete = async () => {
        await isLoading(async () => {
            try {
                await request(`/books?id=eq.${bookId}`, 'DELETE');
                showNotification('Book deleted successfully!');
                navigate('/my-books');
            } catch (error) {
                showNotification(`Failed to delete book: ${error.message}`, 'error');
            }
        })
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    const isOwner = book && user && book.user_id === user.id;

    return (
        <>
            <div className="details-container">
                <h2>Book Details</h2>
                {book ? (
                    <>
                        <img src={book.imageUrl || book.imageurl} alt={book.title} />
                        <h3>Title: {book.title}</h3>
                        <p>Author: {book.author}</p>
                        <p>Genre: {book.genre}</p>
                        <p>Description: {book.description}</p>

                        {isOwner && (
                            <div className="book-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '15px' }}>
                                <Link to={`/edit/${book.id}`} className="form-btn">Edit</Link>
                                <button onClick={() => setShowDeleteModal(true)} className="form-btn danger-btn">
                                    Delete
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p>Book not found.</p>
                )}
                <button onClick={() => navigate(-1)} className="form-btn shelf-btn-secondary" style={{ marginTop: '15px' }}>Back</button>
            </div>

            <ConfirmModal
                isOpen={showDeleteModal}
                title="Confirm Deletion"
                message="Are you sure you want to delete this book?"
                confirmText="Delete"
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </>
    );
}