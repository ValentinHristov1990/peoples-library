import { useState } from "react";
import request from "../Components/utils/request";
import useBookDragDrop from "./useBookDragDrop";
import {
  CONFIRM_MESSAGES,
  CONFIRM_TITLES,
} from "../constants/confirmModalConst";
import { findBookInCollections } from "../Components/utils/shelfIdFinder";

export function useShelfBooks(
  collections,
  setCollections,
  fetchShelves,
  isLoading,
  showNotification,
  triggerConfirm,
  activeCollectionId,
  setActiveCollectionId,
  setSelectedBook,
  setSelectedCollectionId,
) {
  const [dbBooks, setDbBooks] = useState([]);

  const {
    dragOverBookId,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useBookDragDrop(collections, setCollections);

  const fetchBooks = async () => {
    await isLoading(async () => {
      try {
        const data = await request("/books");
        setDbBooks(data || []);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    });
  };

  function handleStatusUpdate(bookId, newStatus) {
    setCollections((prevCollections) =>
      prevCollections.map((col) => ({
        ...col,
        books: col.books.map((book) =>
          book.id === bookId ? { ...book, status: newStatus } : book,
        ),
      })),
    );
  }

  const toggleBookSelection = (bookId, selectedBookIds, setSelectedBookIds) => {
    setSelectedBookIds((curr) => {
      if (curr.includes(bookId)) {
        return curr.filter((id) => id !== bookId);
      }
      return [...curr, bookId];
    });
  };

  async function handleAddSelectedBooks(
    selectedBookIds,
    setSearchFilter,
    setSelectedGenre,
  ) {
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
        setSearchFilter("");
        setSelectedGenre("");
        fetchShelves();
      } catch (error) {
        showNotification(`Failed to add books: ${error.message}`, "error");
      }
    });
  }

  function handleRemoveBook(bookId) {
    const found = findBookInCollections(collections, bookId);

    if (!found) {
      showNotification("Book not found!", "error");
      return;
    }

    const { collectionId: targetCollectionId, book: bookToRemove } = found;

    triggerConfirm(
      CONFIRM_TITLES.REMOVE_BOOK,
      CONFIRM_MESSAGES.REMOVE_BOOK,
      async () => {
        await isLoading(async () => {
          try {
            if (bookToRemove?.shelfBookId) {
              await request(
                `/shelf_books?id=eq.${bookToRemove.shelfBookId}`,
                "DELETE",
              );
            }

            setCollections((currCollections) =>
              currCollections.map((col) => {
                if (col.id !== targetCollectionId) return col;
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
  }

  function handleSaveNotes(bookId, updatedNotes) {
    const found = findBookInCollections(collections, bookId);

    if (!found) {
      showNotification("Book not found!", "error");
      return;
    }

    const { collectionId } = found;

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
    showNotification("Notes saved successfully!");
  }

  const allGenres = [
    ...new Set(dbBooks.map((book) => book.genre).filter(Boolean)),
  ];

  return {
    dbBooks,
    setDbBooks,
    fetchBooks,
    handleStatusUpdate,
    toggleBookSelection,
    handleAddSelectedBooks,
    handleRemoveBook,
    handleSaveNotes,
    allGenres,
    dragOverBookId,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
