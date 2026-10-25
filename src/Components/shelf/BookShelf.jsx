import { useState, useEffect } from 'react';
import ShelfRow from './shelf-row/ShelfRow';
import BookDetailsModal from './book-details-modal/BookDetailsModal';
import BookPreviewModal from './book-preview-modal/BookPreviewModal';
import CatalogModal from './catalog-modal/CatalogModal';
import BookNotesModal from './notes/BookNotesModal';
import ConfirmModal from './confirm-modal/ConfirmModal';
import { useEscClose } from '../hooks/useEscClose';
import { useNotification } from '../notifications/Notification';
import useAuth from '../../Components/hooks/useAuth';
import request from '../utils/request';
import './bookShelfStyle.css';
import useBookDragDrop from '../hooks/useBookDragDrop';

export default function BookShelf() {
	const { user } = useAuth();
	const { showNotification } = useNotification();

	const libraryName = user?.user_metadata?.username
		? `${user.user_metadata.username.charAt(0).toUpperCase() + user.user_metadata.username.slice(1)}'s Library`
		: user?.username
			? `${user.username.charAt(0).toUpperCase() + user.username.slice(1)}'s Library`
			: "My Library";

	const [collections, setCollections] = useState([]);
	const [dbBooks, setDbBooks] = useState([]);
	const [isCreating, setIsCreating] = useState(false);
	const [newCollectionName, setNewCollectionName] = useState('');
	const [selectedBook, setSelectedBook] = useState(null);
	const [selectedCollectionId, setSelectedCollectionId] = useState(null);
	const [previewBook, setPreviewBook] = useState(null);
	const [activeNoteBook, setActiveNoteBook] = useState(null);

	const {
		dragOverBookId,
		handleDragStart,
		handleDragOver,
		handleDragLeave,
		handleDrop
	} = useBookDragDrop(collections, setCollections);

	const [confirmModal, setConfirmModal] = useState({
		isOpen: false,
		title: '',
		message: '',
		onConfirm: null,
		confirmText: 'Delete'
	});

	useEffect(() => {
		if (user) {
			fetchShelves();
		}
	}, [user]);

	const fetchShelves = async () => {
		try {
			const data = await request(`/shelves?user_id=eq.${user.id}&select=*,shelf_books(*,books(*,notes(*)))`);
			const formatted = (data || []).map(shelf => ({
				id: shelf.id,
				title: shelf.title,
				books: (shelf.shelf_books || []).map(sb => ({
					shelfBookId: sb.id,
					status: sb.status || 'to-read',
					id: sb.books?.id,
					title: sb.books?.title,
					author: sb.books?.author,
					genre: sb.books?.genre,
					description: sb.books?.description,
					imageUrl: sb.books?.imageUrl,
					notes: sb.books?.notes || []
				})).filter(b => b.id)
			}));
			setCollections(formatted);
		} catch (error) {
			showNotification(`Failed to load shelves: ${error.message}`, 'error');
		}
	};

	function handleStatusUpdate(bookId, newStatus) {
		setCollections(prevCollections =>
			prevCollections.map(col => ({
				...col,
				books: col.books.map(book =>
					book.id === bookId ? { ...book, status: newStatus } : book
				)
			}))
		);
	}

	const fetchBooks = async () => {
		try {
			const data = await request('/books');
			setDbBooks(data || []);
		} catch (error) {
			console.error('Failed to fetch books:', error);
		}
	};

	const triggerConfirm = (title, message, onConfirm, confirmText = "Delete") => {
		setConfirmModal({
			isOpen: true,
			title,
			message,
			confirmText,
			onConfirm: () => {
				onConfirm();
				setConfirmModal(curr => ({ ...curr, isOpen: false }));
			}
		});
	};

	const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

	const [activeCollectionId, setActiveCollectionId] = useState(null);
	const [searchFilter, setSearchFilter] = useState('');
	const [selectedGenre, setSelectedGenre] = useState('');
	const [selectedBookIds, setSelectedBookIds] = useState([]);

	useEffect(() => {
		if (activeCollectionId !== null && dbBooks.length === 0) {
			fetchBooks();
		}
	}, [activeCollectionId, dbBooks.length]);

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

	function handleMouseDown(e) {
		if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
		setIsDragging(true);
		setDragStart({
			x: e.clientX - previewPos.x,
			y: e.clientY - previewPos.y
		});
	}

	useEscClose({
		confirmModal,
		setConfirmModal,
		activeNoteBook,
		setActiveNoteBook,
		previewBook,
		setPreviewBook,
		selectedBook,
		setSelectedBook,
		setSelectedCollectionId,
		activeCollectionId,
		setActiveCollectionId,
		isCreating,
		setIsCreating
	});

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

	async function handleCreateCollection(e) {
		e.preventDefault();
		if (!newCollectionName.trim()) {
			showNotification('Collection name cannot be empty!', 'error');
			return;
		}

		try {
			await request('/shelves', 'POST', {
				title: newCollectionName.trim(),
				user_id: user.id
			});

			setNewCollectionName('');
			setIsCreating(false);
			showNotification('Collection created successfully!');
			fetchShelves();
		} catch (error) {
			showNotification(`Failed to create collection: ${error.message}`, 'error');
		}
	}

	function handleDeleteCollection(collectionId) {
		triggerConfirm(
			"Delete Collection",
			"Are you sure you want to delete this collection?",
			async () => {
				try {
					await request(`/shelves?id=eq.${collectionId}`, 'DELETE');
					if (activeCollectionId === collectionId) {
						setActiveCollectionId(null);
					}
					showNotification('Collection deleted successfully!');
					fetchShelves();
				} catch (error) {
					showNotification(`Failed to delete collection: ${error.message}`, 'error');
				}
			},
			"Delete"
		);
	}

	const toggleBookSelection = (bookId) => {
		setSelectedBookIds(curr => {
			if (curr.includes(bookId)) {
				return curr.filter(id => id !== bookId);
			}
			return [...curr, bookId];
		});
	};

	async function handleAddSelectedBooks() {
		if (selectedBookIds.length === 0 || !activeCollectionId) return;

		try {
			for (const bookId of selectedBookIds) {
				await request('/shelf_books', 'POST', {
					shelf_id: activeCollectionId,
					book_id: bookId
				});
			}

			showNotification('Books added to collection successfully!');
			setActiveCollectionId(null);
			setSelectedBookIds([]);
			setSearchFilter('');
			setSelectedGenre('');
			fetchShelves();
		} catch (error) {
			showNotification(`Failed to add books: ${error.message}`, 'error');
		}
	}

	function handleRemoveBook(bookId) {
		triggerConfirm(
			"Remove Book",
			"Are you sure you want to remove this book from the shelf?",
			async () => {
				try {
					const currentCollection = collections.find(col => col.id === selectedCollectionId);
					const bookToRemove = currentCollection?.books.find(b => b.id === bookId);

					if (bookToRemove?.shelfBookId) {
						await request(`/shelf_books?id=eq.${bookToRemove.shelfBookId}`, 'DELETE');
					}

					setCollections(currCollections =>
						currCollections.map(col => {
							if (col.id !== selectedCollectionId) return col;
							return {
								...col,
								books: col.books.filter(b => b.id !== bookId)
							};
						})
					);

					setSelectedBook(null);
					setSelectedCollectionId(null);
					showNotification('Book removed from shelf successfully!');
				} catch (error) {
					showNotification(`Failed to remove book: ${error.message}`, 'error');
				}
			},
			"Remove"
		);
	}

	function handleSaveNotes(collectionId, bookId, updatedNotes) {
		setCollections(currCollections =>
			currCollections.map(col => {
				if (col.id !== collectionId) return col;

				const updatedBooks = col.books.map(b => {
					if (b.id === bookId) {
						return { ...b, notes: updatedNotes };
					}
					return b;
				});

				return { ...col, books: updatedBooks };
			})
		);

		if (selectedBook && selectedBook.id === bookId) {
			setSelectedBook(prev => ({ ...prev, notes: updatedNotes }));
		}
		showNotification('Notes saved successfully!');
	}

	const allGenres = [...new Set(dbBooks.map(book => book.genre).filter(Boolean))];

	const filteredCatalogBooks = dbBooks.filter(book => {
		const title = book.title?.toLowerCase() || '';
		const author = book.author?.toLowerCase() || '';
		const query = searchFilter.toLowerCase();

		const matchesQuery = title.includes(query) || author.includes(query);
		const matchesGenre = !selectedGenre || book.genre === selectedGenre;

		return matchesQuery && matchesGenre;
	});

	const activeCollection = collections.find(col => col.id === activeCollectionId);
	const existingBookIdsInActiveShelf = new Set(activeCollection?.books.map(b => b.id) || []);

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