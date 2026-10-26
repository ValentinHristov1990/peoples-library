import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNotification } from '../../notifications/useNotification';
import { BOOK_STATUSES, STATUS_ICONS } from '../../../constants/bookStatusConst';
import request from '../../utils/request';
import './shelfRowStyle.css';

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
    const [dropdownPosition, setDropdownPosition] = useState(null);
    const dropdownRef = useRef(null);
    const { showNotification } = useNotification();

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                openDropdownBookId &&
                !event.target.closest('.mini-book-status-wrapper') &&
                !dropdownRef.current?.contains(event.target)
            ) {
                setOpenDropdownBookId(null);
                setDropdownPosition(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdownBookId]);

    function toggleStatusDropdown(bookId, event) {
        event.stopPropagation();
        if (openDropdownBookId === bookId) {
            setOpenDropdownBookId(null);
            setDropdownPosition(null);
            return;
        }

        const triggerRect = event.currentTarget.getBoundingClientRect();
        const centerX = triggerRect.left + triggerRect.width / 2;
        const left = Math.min(Math.max(centerX, 75), window.innerWidth - 75);

        setDropdownPosition({
            left,
            top: triggerRect.bottom + 6,
            transform: 'translateX(-50%)'
        });
        setOpenDropdownBookId(bookId);
    }

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
            setDropdownPosition(null);
            showNotification('Book status updated successfully!', 'success');
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
                        <div key={book.id} className="mini-book-item-wrapper">
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

                            <div className="mini-book-actions-row">
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
                                    <div className="mini-book-status-wrapper">
                                        <span
                                            className="mini-book-status-icon"
                                            onClick={(e) => toggleStatusDropdown(book.shelfBookId, e)}
                                            title="Change status"
                                        >
                                            {STATUS_ICONS[book.status] || '📖'}
                                        </span>

                                        {openDropdownBookId === book.shelfBookId && dropdownPosition && createPortal(
                                            <div
                                                ref={dropdownRef}
                                                className="quick-status-dropdown"
                                                style={{ ...dropdownPosition, position: 'fixed', bottom: 'auto', marginBottom: 0 }}
                                                onMouseDown={(e) => e.stopPropagation()}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {BOOK_STATUSES.map(opt => (
                                                    <div
                                                        key={opt.id}
                                                        className="quick-status-option"
                                                        onClick={(e) => handleQuickStatusChange(book.shelfBookId, opt.id, book.id, e)}
                                                    >
                                                        <span>{opt.icon}</span>
                                                        <span>{opt.label}</span>
                                                    </div>
                                                ))}
                                            </div>,
                                            document.body
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="shelf-row-footer">
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