import { useState } from "react";

export default function useBookDragDrop(collections, setCollections) {
  const [draggedBookInfo, setDraggedBookInfo] = useState(null);
  const [dragOverBookId, setDragOverBookId] = useState(null);

  const handleDragStart = (e, bookId, collectionId) => {
    setDraggedBookInfo({ bookId, collectionId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, bookId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverBookId !== bookId) {
      setDragOverBookId(bookId);
    }
  };

  const handleDragLeave = () => {
    setDragOverBookId(null);
  };

  const handleDrop = (e, targetBookId, targetCollectionId) => {
    e.preventDefault();
    setDragOverBookId(null);

    if (!draggedBookInfo) return;

    const { bookId: sourceBookId, collectionId: sourceCollectionId } =
      draggedBookInfo;

    if (sourceCollectionId !== targetCollectionId) return;
    if (sourceBookId === targetBookId) return;

    setCollections((prevCollections) => {
      return prevCollections.map((col) => {
        if (col.id === targetCollectionId) {
          const books = [...col.books];
          const sourceIndex = books.findIndex((b) => b.id === sourceBookId);
          const targetIndex = books.findIndex((b) => b.id === targetBookId);

          if (sourceIndex !== -1 && targetIndex !== -1) {
            const [movedBook] = books.splice(sourceIndex, 1);
            books.splice(targetIndex, 0, movedBook);
          }
          return { ...col, books };
        }
        return col;
      });
    });

    setDraggedBookInfo(null);
  };

  return {
    dragOverBookId,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
