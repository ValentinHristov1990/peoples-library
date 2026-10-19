export default function BookPreviewModal({
    book,
    previewPos,
    onMouseDown,
    onClose
}) {
    if (!book) return null;

    return (
        <div className="preview-modal-backdrop">
            <div
                className="preview-modal-card"
                onMouseDown={onMouseDown}
                style={{
                    left: `calc(50% + ${previewPos.x}px)`,
                    top: `calc(50% + ${previewPos.y}px)`,
                    transform: 'translate(-50%, -50%)'
                }}
            >
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
                    className="form-btn shelf-btn-secondary"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}