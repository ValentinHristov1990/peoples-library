import { useEffect } from 'react';

export function useEscClose({
    confirmModal, setConfirmModal,
    activeNoteBook, setActiveNoteBook,
    previewBook, setPreviewBook,
    selectedBook, setSelectedBook, setSelectedCollectionId,
    activeCollectionId, setActiveCollectionId,
    isCreating, setIsCreating
}) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (confirmModal.isOpen) {
                    setConfirmModal(curr => ({ ...curr, isOpen: false }));
                } else if (activeNoteBook !== null) {
                    setActiveNoteBook(null);
                } else if (previewBook !== null) {
                    setPreviewBook(null);
                } else if (selectedBook !== null) {
                    setSelectedBook(null);
                    setSelectedCollectionId(null);
                } else if (activeCollectionId !== null) {
                    setActiveCollectionId(null);
                } else if (isCreating) {
                    setIsCreating(false);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [confirmModal, activeNoteBook, previewBook, selectedBook, activeCollectionId, isCreating]);
}