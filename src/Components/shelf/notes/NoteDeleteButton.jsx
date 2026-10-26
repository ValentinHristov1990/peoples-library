import request from '../../utils/request';
import { useNotification } from '../../notifications/useNotification';

export default function NoteDeleteButton({ noteId, onDeleteSuccess, onConfirmAction }) {
    const { showNotification } = useNotification();

    const handleDelete = () => {
        onConfirmAction(
            "Delete Note",
            "Are you sure you want to delete this note?",
            async () => {
                try {
                    await request(`/notes?id=eq.${noteId}`, 'DELETE');
                    onDeleteSuccess(noteId);
                    showNotification('Note deleted successfully!');
                } catch (error) {
                    showNotification(`Failed to delete note: ${error.message}`, 'error');
                }
            }
        );
    };

    return (
        <button
            type="button"
            className="form-btn note-delete-btn"
            onClick={handleDelete}
        >
            Delete
        </button>
    );
}