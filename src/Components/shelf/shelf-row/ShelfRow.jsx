export default function ShelfRow({
    collection,
    onAddBookClick,
    onBookClick,
    onDragStart,
    onDragOver,
    onDrop
}) {
    return (
        <div className="shelf-row-section">
            <div className="shelf-row-header">
                <h3 className="shelf-row-title">{collection.title}</h3>
                <button
                    className="form-btn shelf-row-add-btn"
                    onClick={onAddBookClick}
                >
                    + Add Book
                </button>
            </div>

            {collection.books.length === 0 ? (
                <div className="empty-shelf-notice">
                    This shelf is empty. Click "+ Add Book" to place books here.
                </div>
            ) : (
                <div className="shelf-books-grid">
                    {collection.books.map((book) => (
                        <div
                            key={book.id}
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
                    ))}
                </div>
            )}
        </div>
    );
}