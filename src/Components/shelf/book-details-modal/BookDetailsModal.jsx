export default function BookDetailsModal({
    book,
    onClose,
    onRemove
}) {
    if (!book) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
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

                <button
                    className="form-btn"
                    onClick={() => onRemove(book.id)}
                >
                    Remove from Shelf
                </button>
            </div>
        </div>
    );
}