import { useState, useEffect, useCallback } from "react";
import useAuth from "./useAuth";
import request from "../Components/utils/request";
import { useNotification } from "../Components/notifications/useNotification";
import useLoading from "./useLoading";
import {
  CONFIRM_MESSAGES,
  CONFIRM_TITLES,
} from "../constants/confirmModalConst";

export function useShelfCollections() {
  const { user } = useAuth();
  const { isLoading } = useLoading();
  const { showNotification } = useNotification();

  const username = user?.user_metadata?.username || user?.username;
  const libraryName = username
    ? `${username.charAt(0).toUpperCase() + username.slice(1)}'s Library`
    : "My Library";

  const [collections, setCollections] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [activeCollectionId, setActiveCollectionId] = useState(null);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    confirmText: "Delete",
  });

  const fetchShelves = useCallback(
    async (showLoading = false) => {
      const loadShelves = async () => {
        try {
          const data = await request(
            `/shelves?user_id=eq.${user.id}&select=*,shelf_books(*,books(*,notes(*)))`,
          );
          const formatted = (data || []).map((shelf) => ({
            id: shelf.id,
            title: shelf.title,
            books: (shelf.shelf_books || [])
              .map((sb) => ({
                shelfBookId: sb.id,
                status: sb.status || "to-read",
                id: sb.books?.id,
                title: sb.books?.title,
                author: sb.books?.author,
                genre: sb.books?.genre,
                description: sb.books?.description,
                imageUrl: sb.books?.imageUrl,
                notes: sb.books?.notes || [],
              }))
              .filter((b) => b.id),
          }));
          setCollections(formatted);
        } catch (error) {
          showNotification(`Failed to load shelves: ${error.message}`, "error");
        }
      };

      if (showLoading) {
        await isLoading(loadShelves);
      } else {
        await loadShelves();
      }
    },
    [isLoading, showNotification, user],
  );

  useEffect(() => {
    if (user) {
      fetchShelves(true);
    }
  }, [user, fetchShelves]);

  const triggerConfirm = (
    title,
    message,
    onConfirm,
    confirmText = "Delete",
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      onConfirm: () => {
        onConfirm();
        setConfirmModal((curr) => ({ ...curr, isOpen: false }));
      },
    });
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) {
      showNotification("Collection name cannot be empty!", "error");
      return;
    }

    await isLoading(async () => {
      try {
        await request("/shelves", "POST", {
          title: newCollectionName.trim(),
          user_id: user.id,
        });

        setNewCollectionName("");
        setIsCreating(false);
        showNotification("Collection created successfully!");
        fetchShelves();
      } catch (error) {
        showNotification(
          `Failed to create collection: ${error.message}`,
          "error",
        );
      }
    });
  };

  const handleDeleteCollection = (collectionId, collectionTitle) => {
    triggerConfirm(
      CONFIRM_TITLES.DELETE_COLLECTION,
      CONFIRM_MESSAGES.DELETE_COLLECTION(collectionTitle),
      async () => {
        await isLoading(async () => {
          try {
            await request(`/shelves?id=eq.${collectionId}`, "DELETE");
            if (activeCollectionId === collectionId) {
              setActiveCollectionId(null);
            }
            showNotification("Collection deleted successfully!");
            fetchShelves();
          } catch (error) {
            showNotification(
              `Failed to delete collection: ${error.message}`,
              "error",
            );
          }
        });
      },
      "Delete",
    );
  };

  return {
    user,
    libraryName,
    collections,
    setCollections,
    isCreating,
    setIsCreating,
    newCollectionName,
    setNewCollectionName,
    activeCollectionId,
    setActiveCollectionId,
    confirmModal,
    setConfirmModal,
    fetchShelves,
    triggerConfirm,
    handleCreateCollection,
    handleDeleteCollection,
    isLoading,
    showNotification,
  };
}
