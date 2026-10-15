import { useState, useEffect } from 'react';
import { allBooks } from '../../books-data/allBooks';
import './bookShelfStyle.css';

export default function BookShelf({ user }) {
	const libraryName = user?.username ? `${user.username.charAt(0).toUpperCase() + user.username.slice(1)}'s Library` : "My Library";

	const [collections, setCollections] = useState([]);

	const [isCreating, setIsCreating] = useState(false);
	const [newCollectionName, setNewCollectionName] = useState('');
	const [selectedBook, setSelectedBook] = useState(null);
	const [previewBook, setPreviewBook] = useState(null);

	const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

	const [activeCollectionId, setActiveCollectionId] = useState(null);
	const [searchFilter, setSearchFilter] = useState('');
	const [selectedBookIds, setSelectedBookIds] = useState([]);

	useEffect(() => {
		const handleMouseMove = (e) => {
			if (!isDragging) return;
			setPreviewPos({
				x: e.clientX - dragStart.x,
				y: e.clientY - dragStart.y
			});
		};

		const handleMouseUp = () => {
			setIsDragging(false);
		};

		if (isDragging) {
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mouseup', handleMouseUp);
		}

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isDragging, dragStart]);

	const handleMouseDown = (e) => {
		if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
		setIsDragging(true);
		setDragStart({
			x: e.clientX - previewPos.x,
			y: e.clientY - previewPos.y
		});
	};

	if (!user) {
		return (
			<div className="form-container">
				<div className="form-card" style={{ textAlign: 'center' }}>
					<h2 className="form-title">My Shelf</h2>
					<p className="form-footer">Log in to view and manage your personal bookshelf.</p>
				</div>
			</div>
		);
	}

	function handleCreateCollection(e) {
		e.preventDefault();
		if (!newCollectionName.trim()) return;

		const newCol = {
			id: Date.now(),
			title: newCollectionName.trim(),
			books: []
		};

		setCollections(curr => [...curr, newCol]);
		setNewCollectionName('');
		setIsCreating(false);
	}

	function toggleBookSelection(bookId) {
		setSelectedBookIds(curr =>
			curr.includes(bookId) ? curr.filter(id => id !== bookId) : [...curr, bookId]
		);
	}

	function handleAddSelectedBooks() {
		if (selectedBookIds.length === 0) return;

		const booksToAdd = allBooks.filter(b => selectedBookIds.includes(b.id));

		setCollections(currCollections =>
			currCollections.map(col => {
				if (col.id === activeCollectionId) {
					const existingIds = new Set(col.books.map(b => b.id));
					const uniqueNewBooks = booksToAdd.filter(b => !existingIds.has(b.id));
					return { ...col, books: [...col.books, ...uniqueNewBooks] };
				}
				return col;
			})
		);

		setActiveCollectionId(null);
		setSelectedBookIds([]);
		setSearchFilter('');
	}

	function handleRemoveBook(bookId) {
		setCollections(currCollections =>
			currCollections.map(col => ({
				...col,
				books: col.books.filter(b => b.id !== bookId)
			}))
		);
		setSelectedBook(null);
	}

	const filteredCatalogBooks = allBooks.filter(book => {
		const title = book.title?.toLowerCase() || '';
		const author = book.author?.toLowerCase() || '';
		const query = searchFilter.toLowerCase();
		return title.includes(query) || author.includes(query);
	});

	return (
		<div className="shelf-wide-container">
			<div className="shelf-header-row">
				<h2 className="shelf-main-title">{libraryName}</h2>

				{!isCreating ? (
					<button
						className="form-btn"
						onClick={() => setIsCreating(true)}
					>
						+ New Collection
					</button>
				) : (
					<form onSubmit={handleCreateCollection} className="new-collection-form-inline">
						<input
							type="text"
							className="form-input"
							placeholder="Collection name..."
							value={newCollectionName}
							onChange={(e) => setNewCollectionName(e.target.value)}
							autoFocus
							required
						/>
						<button type="submit" className="form-btn">
							Create
						</button>
						<button
							type="button"
							className="form-btn shelf-btn-secondary"
							onClick={() => setIsCreating(false)}
						>
							Cancel
						</button>
					</form>
				)}
			</div>

			<div className="collections-container">
				{collections.length === 0 ? (
					<div className="empty-shelf-notice">
						No collections yet. Click "+ New Collection" above to create your first shelf row!
					</div>
				) : (
					collections.map((col) => (
						<div key={col.id} className="shelf-row-section">
							<div className="shelf-row-header">
								<h3 className="shelf-row-title">{col.title}</h3>
								<button
									className="form-btn shelf-row-add-btn"
									onClick={() => {
										setActiveCollectionId(col.id);
										setSelectedBookIds([]);
									}}
								>
									+ Add Book
								</button>
							</div>

							{col.books.length === 0 ? (
								<div className="empty-shelf-notice">
									This shelf is empty. Click "+ Add Book" to place books here.
								</div>
							) : (
								<div className="shelf-books-grid">
									{col.books.map((book) => (
										<div
											key={book.id}
											className="mini-book-card"
											onClick={() => setSelectedBook(book)}
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
					))
				)}
			</div>

			{selectedBook && (
				<div className="modal-backdrop" onClick={() => setSelectedBook(null)}>
					<div className="modal-card" onClick={(e) => e.stopPropagation()}>
						<button className="modal-close-btn" onClick={() => setSelectedBook(null)}>✕</button>

						{(selectedBook.imageUrl || selectedBook.img) && (
							<div className="modal-img-container">
								<img src={selectedBook.imageUrl || selectedBook.img} alt={selectedBook.title} className="modal-book-preview-img" />
							</div>
						)}

						<h3 className="modal-title">{selectedBook.title}</h3>
						<p className="modal-author">Author: {selectedBook.author}</p>
						<p className="modal-desc">{selectedBook.description || 'No description available for this book.'}</p>

						<button
							className="form-btn"
							onClick={() => handleRemoveBook(selectedBook.id)}
						>
							Remove from Shelf
						</button>
					</div>
				</div>
			)}

			{previewBook && (
				<div className="preview-modal-backdrop">
					<div
						className="preview-modal-card"
						onMouseDown={handleMouseDown}
						style={{
							left: `calc(50% + ${previewPos.x}px)`,
							top: `calc(50% + ${previewPos.y}px)`,
							transform: 'translate(-50%, -50%)'
						}}
					>
						<button className="modal-close-btn" onClick={() => setPreviewBook(null)}>✕</button>

						{(previewBook.imageUrl || previewBook.img) && (
							<div className="modal-img-container">
								<img src={previewBook.imageUrl || previewBook.img} alt={previewBook.title} className="modal-book-preview-img" />
							</div>
						)}

						<h3 className="modal-title">{previewBook.title}</h3>
						<p className="modal-author">Author: {previewBook.author}</p>
						<p className="modal-desc">{previewBook.description || 'No description available for this book.'}</p>

						<button
							className="form-btn shelf-btn-secondary"
							onClick={() => setPreviewBook(null)}
						>
							Close
						</button>
					</div>
				</div>
			)}

			{activeCollectionId !== null && (
				<div className="modal-backdrop" onClick={() => setActiveCollectionId(null)}>
					<div className="modal-card" onClick={(e) => e.stopPropagation()}>
						<button className="modal-close-btn" onClick={() => setActiveCollectionId(null)}>✕</button>
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
						</div>

						<div className="catalog-picker-list">
							{filteredCatalogBooks.length > 0 ? (
								filteredCatalogBooks.map((catBook) => {
									const isChecked = selectedBookIds.includes(catBook.id);
									return (
										<div
											key={catBook.id}
											className={`catalog-picker-item ${isChecked ? 'catalog-item-checked' : ''}`}
										>
											<div className="catalog-picker-info" onClick={() => toggleBookSelection(catBook.id)}>
												<input
													type="checkbox"
													checked={isChecked}
													onChange={() => toggleBookSelection(catBook.id)}
													className="catalog-checkbox"
													onClick={(e) => e.stopPropagation()}
												/>
												<img src={catBook.imageUrl || catBook.img} alt={catBook.title} className="catalog-picker-img" />
												<div className="catalog-picker-text">
													<h5 className="catalog-book-title">{catBook.title}</h5>
													<p>{catBook.author}</p>
												</div>
											</div>

											<button
												type="button"
												className="form-btn shelf-btn-secondary shelf-view-btn"
												onClick={(e) => {
													e.stopPropagation();
													setPreviewBook(catBook);
													setPreviewPos({ x: 0, y: 0 });
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
							onClick={handleAddSelectedBooks}
							disabled={selectedBookIds.length === 0}
						>
							Add Selected Books ({selectedBookIds.length})
						</button>
					</div>
				</div>
			)}
		</div>
	);
}