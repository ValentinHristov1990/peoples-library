import request from "../../utils/request";
import {
  CONFIRM_MESSAGES,
  CONFIRM_TITLES,
} from "../../constants/confirmModalConst";

export function createShelfCollectionActions({
  user,
  isLoading,
  showNotification,
  fetchShelves,
  activeCollectionId,
  setActiveCollectionId,
  setIsCreating,
  setNewCollectionName,
  triggerConfirm,
}) {
  const handleCreateCollection = async (e, newCollectionName) => {
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
    handleCreateCollection,
    handleDeleteCollection,
  };
}
