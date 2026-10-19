export default function CatalogModal({
    isOpen,
    onClose,
    searchFilter,
    setSearchFilter,
    selectedGenre,
    setSelectedGenre,
    allGenres,
    filteredCatalogBooks,
    existingBookIdsInActiveShelf,
    selectedBookIds,
    toggleBookSelection,
    onViewBook,
    onAddSelectedBooks
}) {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>✕</button>
                <h3 className="modal-title">Select Books from Catalog</h3>

                <div className="form-group shelf-search-group">
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search catalog books by title or author..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        autoFocus
                    />

                    <select
                        className="form-input shelf-genre-select"
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                    >
                        <option value="">All Genres</option>
                        {allGenres.map(genre => (
                            <option key={genre} value={genre}>{genre}</option>
                        ))}
                    </select>
                </div>

                <div className="catalog-picker-list">
                    {filteredCatalogBooks.length > 0 ? (
                        filteredCatalogBooks.map((catBook) => {
                            const isAlreadyAdded = existingBookIdsInActiveShelf.has(catBook.id);
                            const isChecked = selectedBookIds.includes(catBook.id);

                            return (
                                <div
                                    key={catBook.id}
                                    className={`catalog-picker-item ${isChecked ? 'catalog-item-checked' : ''} ${isAlreadyAdded ? 'catalog-item-already-added' : ''}`}
                                >
                                    <div
                                        className={`catalog-picker-info ${isAlreadyAdded ? 'catalog-picker-info-disabled' : ''}`}
                                        onClick={() => {
                                            if (!isAlreadyAdded) toggleBookSelection(catBook.id);
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked || isAlreadyAdded}
                                            disabled={isAlreadyAdded}
                                            onChange={() => {
                                                if (!isAlreadyAdded) toggleBookSelection(catBook.id);
                                            }}
                                            className="catalog-checkbox"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <img src={catBook.imageUrl || catBook.img} alt={catBook.title} className="catalog-picker-img" />
                                        <div className="catalog-picker-text">
                                            <h5 className="catalog-book-title">
                                                {catBook.title}
                                                {isAlreadyAdded && (
                                                    <span className="already-added-label">
                                                        (Already on this shelf)
                                                    </span>
                                                )}
                                            </h5>
                                            <p>{catBook.author}</p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="form-btn shelf-btn-secondary shelf-view-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onViewBook(catBook);
                                        }}
                                    >
                                        View
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <p className="empty-shelf-notice">No books found in catalog.</p>
                    )}
                </div>

                <button
                    className="form-btn"
                    onClick={onAddSelectedBooks}
                    disabled={selectedBookIds.length === 0}
                >
                    Add Selected Books ({selectedBookIds.length})
                </button>
            </div>
        </div>
    );
}