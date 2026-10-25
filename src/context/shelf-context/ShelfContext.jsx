import { createContext, useContext, useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNotification } from '../../Components/notifications/Notification';
import useLoading from '../../hooks/useLoading';
import { useEscClose } from '../../hooks/useEscClose';
import { useShelfCollections } from '../../hooks/useShelfCollections';
import { useShelfBooks } from '../../hooks/useShelfBooks';

const ShelfContext = createContext();

export function ShelfProvider({ children }) {
    const { user } = useAuth();
    const { loading, isLoading } = useLoading();
    const { showNotification } = useNotification();

    const [isCreating, setIsCreating] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedCollectionId, setSelectedCollectionId] = useState(null);
    const [previewBook, setPreviewBook] = useState(null);
    const [activeNoteBook, setActiveNoteBook] = useState(null);

    const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const [activeCollectionId, setActiveCollectionId] = useState(null);
    const [searchFilter, setSearchFilter] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedBookIds, setSelectedBookIds] = useState([]);

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        confirmText: 'Delete'
    });

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

    const collectionsState = useShelfCollections(user, isLoading, showNotification, activeCollectionId, setActiveCollectionId, triggerConfirm);

    const booksState = useShelfBooks(
        collectionsState.collections,
        collectionsState.setCollections,
        collectionsState.fetchShelves,
        isLoading,
        showNotification,
        triggerConfirm,
        activeCollectionId,
        setActiveCollectionId,
        setSelectedBook,
        setSelectedCollectionId
    );

    useEffect(() => {
        if (activeCollectionId !== null && booksState.dbBooks.length === 0) {
            booksState.fetchBooks();
        }
    }, [activeCollectionId, booksState.dbBooks.length]);

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

    const value = {
        user,
        loading,
        activeCollectionId,
        setActiveCollectionId,
        confirmModal,
        setConfirmModal,
        triggerConfirm,
        // UI State & Handlers
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
        isDragging,
        dragStart,
        searchFilter,
        setSearchFilter,
        selectedGenre,
        setSelectedGenre,
        selectedBookIds,
        setSelectedBookIds,
        handleMouseDown,
        // Collections & Books States
        ...collectionsState,
        ...booksState,
        handleRemoveBook: (bookId) => booksState.handleRemoveBook(bookId, selectedCollectionId)
    };

    return (
        <ShelfContext.Provider value={value}>
            {children}
        </ShelfContext.Provider>
    );
}

export function useShelf() {
    return useContext(ShelfContext);
}