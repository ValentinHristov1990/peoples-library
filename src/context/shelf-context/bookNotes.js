export function createBookNotesActions({
  setCollections,
  setSelectedBook,
  showNotification,
}) {
  const handleSaveNotes = (
    collectionId,
    bookId,
    updatedNotes,
    selectedBook,
  ) => {
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

    if (selectedBook && selectedBook.id === bookId) {
      setSelectedBook((prev) => ({ ...prev, notes: updatedNotes }));
    }
    showNotification("Notes saved successfully!");
  };

  return {
    handleSaveNotes,
  };
}
