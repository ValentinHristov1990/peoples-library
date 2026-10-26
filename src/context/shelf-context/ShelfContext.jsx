import { useState, useEffect } from 'react';
import { ShelfContext } from './shelfContext';
import useAuth from '../../hooks/useAuth';
import { useNotification } from '../../Components/notifications/useNotification';
import useLoading from '../../hooks/useLoading';
import { useEscClose } from '../../hooks/useEscClose';
import { useShelfCollections } from '../../hooks/useShelfCollections';
import { useShelfBooks } from '../../hooks/useShelfBooks';

export function ShelfProvider({ children }) {
    const { user } = useAuth();
    const { loading } = useLoading();
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

    const collectionsState = useShelfCollections();
    const {
        activeCollectionId,
        setActiveCollectionId,
        confirmModal,
        setConfirmModal,
        triggerConfirm
    } = collectionsState;

    const booksState = useShelfBooks(
        collectionsState.collections,
        collectionsState.setCollections,
        collectionsState.fetchShelves,
        showNotification,
        triggerConfirm,
        activeCollectionId,
        setActiveCollectionId,
        setSelectedBook,
        setSelectedCollectionId
    );

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
        handleMouseDown,
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