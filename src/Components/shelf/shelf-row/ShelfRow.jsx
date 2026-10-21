import { useState } from 'react';
import ConfirmModal from '../confirm-modal/ConfirmModal';

export default function ShelfRow({
    collection,
    onAddBookClick,
    onDeleteCollection,
    onBookClick,
    onNotesClick,
    onDragStart,
    onDragOver,
    onDrop
}) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    return (
        <div className="shelf-row-section">
            <div className="shelf-row-header">
                <h3 className="shelf-row-title">{collection.title}</h3>
                <button
                    type="button"
                    className="shelf-delete-row-btn"
                    onClick={() => setIsConfirmOpen(true)}
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
                                className="mini-book-card"
                                draggable
                                onDragStart={(e) => onDragStart(e, book.id, collection.id)}
                                onDragOver={onDragOver}
                                onDrop={(e) => onDrop(e, book.id, collection.id)}
                                onClick={() => onBookClick(book)}
                            >
                                <div className="mini-book-img-wrapper">
                                    <img src={book.imageUrl || book.img} alt={book.title} />
                                </div>
                                <h4 className="mini-book-title">{book.title}</h4>
                            </div>

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
                                    📝 {book.notes.length} {book.notes.length === 1 ? 'Note' : 'Notes'}
                                </button>
                            )}
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

            <ConfirmModal
                isOpen={isConfirmOpen}
                title="Delete Collection"
                message={`Are you sure you want to delete the collection "${collection.title}"?`}
                onConfirm={() => {
                    onDeleteCollection(collection.id);
                    setIsConfirmOpen(false);
                }}
                onCancel={() => setIsConfirmOpen(false)}
            />
        </div>
    );
}