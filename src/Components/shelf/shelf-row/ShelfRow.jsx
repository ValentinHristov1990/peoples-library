import { useState, useEffect } from 'react';
import { useNotification } from '../../notifications/useNotification';
import { BOOK_STATUSES, STATUS_ICONS } from '../../../constants/bookStatusConst';
import request from '../../utils/request';

export default function ShelfRow({
    collection,
    onAddBookClick,
    onDeleteCollection,
    onBookClick,
    onNotesClick,
    onDragStart,
    onDragOver,
    onDrop,
    onStatusUpdate,
    onDragLeave,
    dragOverBookId
}) {
    const [openDropdownBookId, setOpenDropdownBookId] = useState(null);
    const { showNotification } = useNotification();

    useEffect(() => {
        function handleClickOutside(event) {
            if (openDropdownBookId && !event.target.closest('.mini-book-status-wrapper')) {
                setOpenDropdownBookId(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdownBookId]);

    async function handleQuickStatusChange(shelfBookId, newStatus, bookId, e) {
        e.stopPropagation();
        try {
            await request(`/shelf_books?id=eq.${shelfBookId}`, 'PATCH', {
                status: newStatus
            });

            if (onStatusUpdate) {
                onStatusUpdate(bookId, newStatus);
            }

            setOpenDropdownBookId(null);
        } catch (error) {
            showNotification(`Failed to update status: ${error.message}`, 'error');
        }
    }

    return (
        <div className="shelf-row-section">
            <div className="shelf-row-header">
                <h3 className="shelf-row-title">{collection.title}</h3>
                <button
                    type="button"
                    className="shelf-delete-row-btn"
                    onClick={() => onDeleteCollection(collection.id, collection.title)}
                    title="Delete collection"
                >
                    ✕
                </button>
            </div>

            {collection.books.length === 0 ? (
                <div className="empty-shelf-notice">
                    This shelf is empty. Click "+ Add Book" below to place books here.
                </div>
            ) : (
                <div className="shelf-books-grid">
                    {collection.books.map((book) => (
                        <div
                            key={book.id}
                            className="mini-book-item-wrapper"
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
                        >
                            <div
                                className={`mini-book-card ${dragOverBookId === book.id ? 'drag-over' : ''}`}
                                draggable
                                onDragStart={(e) => onDragStart(e, book.id, collection.id)}
                                onDragOver={(e) => onDragOver(e, book.id)}
                                onDragLeave={onDragLeave}
                                onDrop={(e) => onDrop(e, book.id, collection.id)}
                                onClick={() => onBookClick(book)}
                            >
                                <div className="mini-book-img-wrapper">
                                    <img src={book.imageUrl || book.img} alt={book.title} />
                                </div>
                                <h4 className="mini-book-title">{book.title}</h4>
                            </div>

                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>

                                {book.notes && book.notes.length > 0 && (
                                    <button
                                        type="button"
                                        className="mini-book-notes-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onNotesClick(book, collection.id);
                                        }}
                                        title="View notes"
                                    >
                                        📝 {book.notes.length}
                                    </button>
                                )}

                                {book.shelfBookId && (
                                    <div
                                        className="mini-book-status-wrapper"
                                        style={{ position: 'relative', display: 'inline-block' }}
                                    >
                                        <span
                                            className="mini-book-status-icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenDropdownBookId(openDropdownBookId === book.shelfBookId ? null : book.shelfBookId);
                                            }}
                                            title="Change status"
                                            style={{ cursor: 'pointer', fontSize: '1.1rem' }}
                                        >
                                            {STATUS_ICONS[book.status] || '📖'}
                                        </span>

                                        {openDropdownBookId === book.shelfBookId && (
                                            <div
                                                className="quick-status-dropdown"
                                                onClick={(e) => e.stopPropagation()}
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '100%',
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    backgroundColor: '#1e1e1e',
                                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
                                                    borderRadius: '6px',
                                                    padding: '4px 0',
                                                    zIndex: 100,
                                                    minWidth: '130px',
                                                    border: '1px solid #444',
                                                    marginBottom: '6px'
                                                }}
                                            >
                                                {BOOK_STATUSES.map(opt => (
                                                    <div
                                                        key={opt.id}
                                                        className="quick-status-option"
                                                        onClick={(e) => handleQuickStatusChange(book.shelfBookId, opt.id, book.id, e)}
                                                        style={{
                                                            padding: '6px 12px',
                                                            fontSize: '0.85rem',
                                                            color: '#fff',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        <span>{opt.icon}</span>
                                                        <span>{opt.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="shelf-row-footer" style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
                <button
                    className="form-btn shelf-row-add-btn"
                    onClick={onAddBookClick}
                >
                    + Add Book
                </button>
            </div>

        </div>
    );
}