export function useBookNotes(
  setCollections,
  setSelectedBook,
  showNotification,
) {
  const handleSaveNotes = (collectionId, bookId, updatedNotes) => {
    setCollections((currCollections) =>
      currCollections.map((col) => {
        if (col.id !== collectionId) return col;

        const updatedBooks = col.books.map((b) => {
          if (b.id === bookId) {
            return { ...b, notes: updatedNotes };
          }
          return b;
        });

        return { ...col, books: updatedBooks };
      }),
    );

    setSelectedBook((prev) => {
      if (prev && prev.id === bookId) {
        return { ...prev, notes: updatedNotes };
      }
      return prev;
    });

    showNotification("Notes saved successfully!");
  };

  return {
    handleSaveNotes,
  };
}
