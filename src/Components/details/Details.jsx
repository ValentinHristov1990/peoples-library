import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import request from '../utils/request';
import ConfirmModal from '../shelf/confirm-modal/ConfirmModal';
import { useNotification } from '../notifications/useNotification';
import useAuth from '../../hooks/useAuth';
import useLoading from '../../hooks/useLoading';
import LoadingSpinner from '../common/LoadingSpinner';
import { useShelf } from '../../context/shelf-context/useShelf';

export default function Details() {
    const { loading, isLoading } = useLoading()
    const { bookId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth()
    const { showNotification } = useNotification();
    const {
        collections,
        loading: shelvesLoading,
        isAddingBookToShelf,
        handleAddBookToCollection
    } = useShelf();

    const [book, setBook] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isShelfMenuOpen, setIsShelfMenuOpen] = useState(false);
    const shelfActionsRef = useRef(null);

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
    }, [bookId, isLoading, showNotification]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!shelfActionsRef.current?.contains(event.target)) {
                setIsShelfMenuOpen(false);
            }
        };

        document.addEventListener('pointerdown', handleOutsideClick);
        return () => document.removeEventListener('pointerdown', handleOutsideClick);
    }, []);

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

                        <div className="details-bottom-actions">
                            {user && (
                                <div className="book-actions shelf-add-actions" ref={shelfActionsRef}>
                                    {collections.length > 0 ? (
                                        <>
                                            <button
                                                type="button"
                                                className="form-btn shelf-row-add-btn"
                                                aria-expanded={isShelfMenuOpen}
                                                aria-controls="add-book-shelf-menu"
                                                onClick={() => setIsShelfMenuOpen((isOpen) => !isOpen)}
                                                disabled={shelvesLoading || isAddingBookToShelf}
                                            >
                                                {isAddingBookToShelf ? 'Adding...' : 'Add to Shelf'}
                                            </button>
                                            <div
                                                id="add-book-shelf-menu"
                                                className={`shelf-add-menu ${isShelfMenuOpen ? 'shelf-add-menu-open' : ''} ${collections.length > 5 ? 'shelf-add-menu-scrollable' : ''}`}
                                                aria-hidden={!isShelfMenuOpen}
                                            >
                                                <div className="shelf-add-menu-inner">
                                                    {collections.map((collection) => {
                                                        const isAlreadyAdded = collection.books.some(
                                                            (shelfBook) => shelfBook.id === book.id,
                                                        );

                                                        return (
                                                            <button
                                                                key={collection.id}
                                                                type="button"
                                                                className="shelf-add-menu-item"
                                                                disabled={isAlreadyAdded || isAddingBookToShelf}
                                                                onClick={async () => {
                                                                    const added = await handleAddBookToCollection(book.id, collection.id);
                                                                    if (added) setIsShelfMenuOpen(false);
                                                                }}
                                                            >
                                                                <span>{collection.title}</span>
                                                                {isAlreadyAdded && <span className="shelf-add-menu-status">Already added</span>}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="form-footer">
                                            {shelvesLoading
                                                ? 'Loading your shelves...'
                                                : <>Create a shelf from <Link to="/shelf">My Shelf</Link> before adding this book.</>}
                                        </p>
                                    )}
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="form-btn shelf-btn-secondary details-back-button"
                            >
                                Back
                            </button>
                        </div>
                    </>
                ) : (
                    <p>Book not found.</p>
                )}
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