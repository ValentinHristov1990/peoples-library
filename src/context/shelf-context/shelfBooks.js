import request from "../../utils/request";
import { createBookNotesActions } from "./bookNotes";
import {
  CONFIRM_MESSAGES,
  CONFIRM_TITLES,
} from "../../constants/confirmModalConst";

export function createShelfBookActions({
  isLoading,
  showNotification,
  setCollections,
  fetchShelves,
  selectedCollectionId,
  setSelectedBook,
  setSelectedCollectionId,
  selectedBookIds,
  setSelectedBookIds,
  setActiveCollectionId,
  setSearchFilter,
  setSelectedGenre,
  triggerConfirm,
}) {
  const handleStatusUpdate = (bookId, newStatus) => {
    setCollections((prevCollections) =>
      prevCollections.map((col) => ({
        ...col,
        books: col.books.map((book) =>
          book.id === bookId ? { ...book, status: newStatus } : book,
        ),
      })),
    );
  };

  const handleAddSelectedBooks = async (activeCollectionId) => {
    if (selectedBookIds.length === 0 || !activeCollectionId) return;

    await isLoading(async () => {
      try {
        for (const bookId of selectedBookIds) {
          await request("/shelf_books", "POST", {
            shelf_id: activeCollectionId,
            book_id: bookId,
          });
        }
        showNotification("Books added to collection successfully!");
        setActiveCollectionId(null);
        setSelectedBookIds([]);
        setSearchFilter("");
        setSelectedGenre("");
        fetchShelves();
      } catch (error) {
        showNotification(`Failed to add books: ${error.message}`, "error");
      }
    });
  };

  const handleRemoveBook = (bookId, collections) => {
    triggerConfirm(
      CONFIRM_TITLES.DELETE_BOOK,
      CONFIRM_MESSAGES.DELETE_BOOK,
      async () => {
        await isLoading(async () => {
          try {
            const currentCollection = collections.find(
              (col) => col.id === selectedCollectionId,
            );
            const bookToRemove = currentCollection?.books.find(
              (b) => b.id === bookId,
            );

            if (bookToRemove?.shelfBookId) {
              await request(
                `/shelf_books?id=eq.${bookToRemove.shelfBookId}`,
                "DELETE",
              );
            }

            setCollections((currCollections) =>
              currCollections.map((col) => {
                if (col.id !== selectedCollectionId) return col;
                return {
                  ...col,
                  books: col.books.filter((b) => b.id !== bookId),
                };
              }),
            );

            setSelectedBook(null);
            setSelectedCollectionId(null);
            showNotification("Book removed from shelf successfully!");
          } catch (error) {
            showNotification(
              `Failed to remove book: ${error.message}`,
              "error",
            );
          }
        });
      },
      "Remove",
    );
  };

  const notesActions = createBookNotesActions({
    setCollections,
    setSelectedBook,
    showNotification,
  });

  return {
    handleStatusUpdate,
    handleAddSelectedBooks,
    handleRemoveBook,
    ...notesActions,
  };
}
