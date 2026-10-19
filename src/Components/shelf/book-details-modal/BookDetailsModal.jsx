import { useState } from 'react';

export default function BookDetailsModal({
    book,
    onClose,
    onRemove,
    onOpenNotes,
}) {
    if (!book) return null;

    const [isMouseDownOutside, setIsMouseDownOutside] = useState(false);
    const notesCount = book.notes?.length || 0;

    return (
        <div
            className="modal-backdrop"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    setIsMouseDownOutside(true);
                } else {
                    setIsMouseDownOutside(false);
                }
            }}
            onClick={(e) => {
                if (isMouseDownOutside && e.target === e.currentTarget) {
                    onClose();
                }
                setIsMouseDownOutside(false);
            }}
        >
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>✕</button>

                {(book.imageUrl || book.img) && (
                    <div className="modal-img-container">
                        <img src={book.imageUrl || book.img} alt={book.title} className="modal-book-preview-img" />
                    </div>
                )}

                <h3 className="modal-title">{book.title}</h3>
                <p className="modal-author">Author: {book.author}</p>
                <p className="modal-desc">{book.description || 'No description available for this book.'}</p>

                <div className="modal-details-actions">
                    <button
                        type="button"
                        className="form-btn shelf-btn-secondary"
                        onClick={onOpenNotes}
                    >
                        📝 Notes ({notesCount})
                    </button>

                    <button
                        type="button"
                        className="form-btn modal-remove-btn"
                        onClick={() => onRemove(book.id)}
                    >
                        Remove from Shelf
                    </button>
                </div>
            </div>
        </div>
    );
}