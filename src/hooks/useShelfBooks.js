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
  showNotification,
  triggerConfirm,
  activeCollectionId,
  setActiveCollectionId,
  setSelectedBook,
  setSelectedCollectionId,
) {
  const [dbBooks, setDbBooks] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState("");
  const [isAddingBooks, setIsAddingBooks] = useState(false);
  const [isAddingBookToShelf, setIsAddingBookToShelf] = useState(false);
  const [isRemovingBook, setIsRemovingBook] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedBookIds, setSelectedBookIds] = useState([]);

  const {
    dragOverBookId,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useBookDragDrop(collections, setCollections);

  const fetchBooks = async () => {
    setCatalogLoading(true);
    setCatalogError("");

    try {
      const data = await request("/books");
      setDbBooks(data || []);
    } catch (error) {
      setCatalogError(error.message);
      showNotification(`Failed to load catalog: ${error.message}`, "error");
    } finally {
      setCatalogLoading(false);
    }
  };

  const toggleBookSelection = (bookId) => {
    setSelectedBookIds((curr) =>
      curr.includes(bookId)
        ? curr.filter((id) => id !== bookId)
        : [...curr, bookId],
    );
  };

  const handleAddSelectedBooks = async () => {
    if (selectedBookIds.length === 0 || !activeCollectionId || isAddingBooks) return;

    setIsAddingBooks(true);
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
      setSelectedBookIds([]);
      await fetchShelves();
    } catch (error) {
      showNotification(`Failed to add books: ${error.message}`, "error");
    } finally {
      setIsAddingBooks(false);
    }
  };

  const handleAddBookToCollection = async (bookId, collectionId) => {
    if (!bookId || !collectionId || isAddingBookToShelf) return false;

    const collection = collections.find((item) => item.id === collectionId);
    if (!collection) {
      showNotification("Please select a valid shelf.", "error");
      return false;
    }

    if (collection.books.some((book) => book.id === bookId)) {
      showNotification("This book is already on the selected shelf.", "error");
      return false;
    }

    setIsAddingBookToShelf(true);
    try {
      await request("/shelf_books", "POST", {
        shelf_id: collectionId,
        book_id: bookId,
      });
      await fetchShelves();
      showNotification(`Book added to "${collection.title}" successfully!`);
      return true;
    } catch (error) {
      showNotification(`Failed to add book to shelf: ${error.message}`, "error");
      return false;
    } finally {
      setIsAddingBookToShelf(false);
    }
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

  function updateBookInShelves(bookId, updatedBook) {
    setCollections((prevCollections) =>
      prevCollections.map((collection) => ({
        ...collection,
        books: collection.books.map((book) =>
          book.id === bookId ? { ...book, ...updatedBook } : book,
        ),
      })),
    );
  }

  function handleRemoveBook(bookId, collectionId) {
    const targetCollection = collections.find(
      (collection) => collection.id === collectionId,
    );
    const book = targetCollection?.books.find((item) => item.id === bookId);
    const found = book
      ? { collectionId: targetCollection.id, book }
      : findBookInCollections(collections, bookId);

    if (!found?.book) {
      showNotification("Book not found!", "error");
      return;
    }

    const { collectionId: targetCollectionId, book: bookToRemove } = found;

    if (!bookToRemove.shelfBookId) {
      showNotification("Could not remove this book because its shelf entry is missing.", "error");
      return;
    }

    triggerConfirm(
      CONFIRM_TITLES.DELETE_BOOK,
      CONFIRM_MESSAGES.DELETE_BOOK,
      async () => {
        setIsRemovingBook(true);
        try {
          await request(
            `/shelf_books?id=eq.${bookToRemove.shelfBookId}`,
            "DELETE",
          );

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
        } finally {
          setIsRemovingBook(false);
        }
      },
      "Remove",
    );
  }

  function handleSaveNotes(collectionId, bookId, updatedNotes) {
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

  const filteredCatalogBooks = dbBooks.filter((book) => {
    const matchesSearch =
      !searchFilter ||
      book.title?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesGenre = !selectedGenre || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const activeCollection = collections.find(
    (col) => col.id === activeCollectionId,
  );
  const existingBookIdsInActiveShelf = new Set(
    activeCollection?.books.map((b) => b.id) || [],
  );

  const allGenres = [
    ...new Set(dbBooks.map((book) => book.genre).filter(Boolean)),
  ];

  return {
    dbBooks,
    setDbBooks,
    fetchBooks,
    catalogLoading,
    catalogError,
    isAddingBooks,
    isAddingBookToShelf,
    isRemovingBook,
    searchFilter,
    setSearchFilter,
    selectedGenre,
    setSelectedGenre,
    selectedBookIds,
    setSelectedBookIds,
    toggleBookSelection,
    handleAddSelectedBooks,
    handleAddBookToCollection,
    filteredCatalogBooks,
    existingBookIdsInActiveShelf,
    allGenres,
    handleStatusUpdate,
    updateBookInShelves,
    handleRemoveBook,
    handleSaveNotes,
    dragOverBookId,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
