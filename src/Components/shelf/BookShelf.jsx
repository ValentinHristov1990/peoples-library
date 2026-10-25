import ShelfRow from './shelf-row/ShelfRow';
import BookDetailsModal from './book-details-modal/BookDetailsModal';
import BookPreviewModal from './book-preview-modal/BookPreviewModal';
import CatalogModal from './catalog-modal/CatalogModal';
import BookNotesModal from './notes/BookNotesModal';
import ConfirmModal from './confirm-modal/ConfirmModal';
import LoadingSpinner from '../common/LoadingSpinner';
import { useShelf } from '../../context/shelf-context/ShelfContext';
import './bookShelfStyle.css';

export default function BookShelf() {
	const {
		user,
		loading,
		libraryName,
		collections,
		isCreating,
		setIsCreating,
		newCollectionName,
		setNewCollectionName,
		selectedBook,
		setSelectedBook,
		selectedCollectionId,
		setSelectedCollectionId,
		previewBook,
		setPreviewBook,
		activeNoteBook,
		setActiveNoteBook,
		previewPos,
		activeCollectionId,
		setActiveCollectionId,
		searchFilter,
		setSearchFilter,
		selectedGenre,
		setSelectedGenre,
		selectedBookIds,
		setSelectedBookIds,
		dragOverBookId,
		confirmModal,
		setConfirmModal,
		handleDragStart,
		handleDragOver,
		handleDragLeave,
		handleDrop,
		handleMouseDown,
		handleCreateCollection,
		handleDeleteCollection,
		handleStatusUpdate,
		toggleBookSelection,
		handleAddSelectedBooks,
		handleRemoveBook,
		handleSaveNotes,
		triggerConfirm,
		allGenres,
		filteredCatalogBooks,
		existingBookIdsInActiveShelf
	} = useShelf();

	if (!user) {
		return (
			<div className="form-container">
				<div className="form-card text-center">
					<h2 className="form-title">My Shelf</h2>
					<p className="form-footer">Log in to view and manage your personal bookshelf.</p>
				</div>
			</div>
		);
	}

	if (loading) {
		return <LoadingSpinner />;
	}

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
						<ShelfRow
							key={col.id}
							collection={col}
							onStatusUpdate={handleStatusUpdate}
							onAddBookClick={() => {
								setActiveCollectionId(col.id);
								setSelectedBookIds([]);
								setSearchFilter('');
								setSelectedGenre('');
							}}
							onDeleteCollection={handleDeleteCollection}
							onConfirmAction={triggerConfirm}
							onBookClick={(book) => {
								setSelectedBook(book);
								setSelectedCollectionId(col.id);
							}}
							onNotesClick={(book, collectionId) => {
								setActiveNoteBook({ book, collectionId });
							}}
							onDragStart={handleDragStart}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							dragOverBookId={dragOverBookId}
						/>
					))
				)}
			</div>

			<BookDetailsModal
				book={selectedBook}
				onClose={() => {
					setSelectedBook(null);
					setSelectedCollectionId(null);
				}}
				onRemove={handleRemoveBook}
				onOpenNotes={() => setActiveNoteBook({ book: selectedBook, collectionId: selectedCollectionId })}
				onStatusUpdated={handleStatusUpdate}
			/>

			<BookNotesModal
				isOpen={activeNoteBook !== null}
				book={activeNoteBook?.book}
				collectionId={activeNoteBook?.collectionId}
				onClose={() => setActiveNoteBook(null)}
				onSaveNotes={handleSaveNotes}
				onConfirmAction={triggerConfirm}
				user={user}
			/>

			<BookPreviewModal
				book={previewBook}
				previewPos={previewPos}
				onMouseDown={handleMouseDown}
				onClose={() => setPreviewBook(null)}
			/>

			<CatalogModal
				isOpen={activeCollectionId !== null}
				onClose={() => setActiveCollectionId(null)}
				searchFilter={searchFilter}
				setSearchFilter={setSearchFilter}
				selectedGenre={selectedGenre}
				setSelectedGenre={setSelectedGenre}
				allGenres={allGenres}
				filteredCatalogBooks={filteredCatalogBooks}
				existingBookIdsInActiveShelf={existingBookIdsInActiveShelf}
				selectedBookIds={selectedBookIds}
				toggleBookSelection={toggleBookSelection}
				onViewBook={(book) => setPreviewBook(book)}
				onAddSelectedBooks={handleAddSelectedBooks}
			/>

			<ConfirmModal
				isOpen={confirmModal.isOpen}
				title={confirmModal.title}
				message={confirmModal.message}
				confirmText={confirmModal.confirmText}
				onConfirm={confirmModal.onConfirm}
				onCancel={() => setConfirmModal(curr => ({ ...curr, isOpen: false }))}
			/>
		</div>
	);
}