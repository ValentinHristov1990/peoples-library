import { useState } from "react";
import request from "../Components/utils/request";
import useBookDragDrop from "./useBookDragDrop";
import {
  CONFIRM_MESSAGES,
  CONFIRM_TITLES,
} from "../constants/confirmModalConst";

export function useShelfBooks(
  collections,
  setCollections,
  fetchShelves,
  isLoading,
  showNotification,
  triggerConfirm,
) {
  const [dbBooks, setDbBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [previewBook, setPreviewBook] = useState(null);
  const [activeNoteBook, setActiveNoteBook] = useState(null);

  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [searchFilter, setSearchFilter] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedBookIds, setSelectedBookIds] = useState([]);

  const { handleSaveNotes } = useBookNotes(
    setCollections,
    setSelectedBook,
    showNotification,
  );

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

  const toggleBookSelection = (bookId) => {
    setSelectedBookIds((curr) => {
      if (curr.includes(bookId)) {
        return curr.filter((id) => id !== bookId);
      }
      return [...curr, bookId];
    });
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
        setSelectedBookIds([]);
        setSearchFilter("");
        setSelectedGenre("");
        fetchShelves();
      } catch (error) {
        showNotification(`Failed to add books: ${error.message}`, "error");
      }
    });
  };

  const handleRemoveBook = (bookId) => {
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

  function handleMouseDown(e) {
    if (e.target.tagName === "BUTTON" || e.target.closest("button")) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - previewPos.x,
      y: e.clientY - previewPos.y,
    });
  }

  const allGenres = [
    ...new Set(dbBooks.map((book) => book.genre).filter(Boolean)),
  ];

  const filteredCatalogBooks = dbBooks.filter((book) => {
    const title = book.title?.toLowerCase() || "";
    const author = book.author?.toLowerCase() || "";
    const query = searchFilter.toLowerCase();

    const matchesQuery = title.includes(query) || author.includes(query);
    const matchesGenre = !selectedGenre || book.genre === selectedGenre;

    return matchesQuery && matchesGenre;
  });

  return {
    dbBooks,
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
    dragOverBookId,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    fetchBooks,
    handleStatusUpdate,
    toggleBookSelection,
    handleAddSelectedBooks,
    handleRemoveBook,
    handleSaveNotes,
    handleMouseDown,
    allGenres,
    filteredCatalogBooks,
  };
}
