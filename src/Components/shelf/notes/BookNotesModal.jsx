import { useState, useEffect } from 'react';
import request from '../../utils/request';
import { useNotification } from '../../notifications/Notification';
import './bookNotesStyle.css';

export default function BookNotesModal({
    isOpen,
    book,
    collectionId,
    onClose,
    onSaveNotes,
    onConfirmAction,
    user,
}) {
    if (!isOpen || !book) return null;

    const { showNotification } = useNotification();
    const [notes, setNotes] = useState(book.notes || []);
    const [activeNote, setActiveNote] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [titleInput, setTitleInput] = useState('');
    const [contentInput, setContentInput] = useState('');
    const [isMouseDownOutside, setIsMouseDownOutside] = useState(false);

    useEffect(() => {
        setNotes(book.notes || []);
        setActiveNote(null);
        setIsCreating(false);
        setIsEditing(false);
    }, [book]);

    function handleStartCreate() {
        setTitleInput('');
        setContentInput('');
        setIsCreating(true);
        setActiveNote(null);
        setIsEditing(false);
    }

    function handleOpenNote(note) {
        setActiveNote(note);
        setTitleInput(note.title);
        setContentInput(note.content);
        setIsCreating(false);
        setIsEditing(false);
    }

    async function handleSaveNewNote(e) {
        e.preventDefault();
        if (!titleInput.trim() || !contentInput.trim()) return;

        try {
            const data = await request('/notes', 'POST', {
                book_id: book.id,
                user_id: user.id,
                title: titleInput.trim(),
                content: contentInput.trim()
            });

            const createdNote = Array.isArray(data) ? data[0] : data;
            const newNote = createdNote || {
                id: Date.now(),
                title: titleInput.trim(),
                content: contentInput.trim()
            };

            const updatedNotes = [...notes, newNote];
            setNotes(updatedNotes);
            onSaveNotes(collectionId, book.id, updatedNotes);

            setIsCreating(false);
            handleOpenNote(newNote);
            showNotification('Note created successfully!');
        } catch (error) {
            showNotification(`Failed to create note: ${error.message}`, 'error');
        }
    }

    async function handleSaveEditedNote() {
        if (!titleInput.trim() || !contentInput.trim()) return;

        try {
            await request(`/notes?id=eq.${activeNote.id}`, 'PATCH', {
                title: titleInput.trim(),
                content: contentInput.trim()
            });

            const updatedNotes = notes.map(n => {
                if (n.id === activeNote.id) {
                    return { ...n, title: titleInput.trim(), content: contentInput.trim() };
                }
                return n;
            });

            setNotes(updatedNotes);
            onSaveNotes(collectionId, book.id, updatedNotes);

            const updatedActiveNote = { ...activeNote, title: titleInput.trim(), content: contentInput.trim() };
            setActiveNote(updatedActiveNote);
            setIsEditing(false);
            showNotification('Note updated successfully!');
        } catch (error) {
            showNotification(`Failed to update note: ${error.message}`, 'error');
        }
    }

    function handleDeleteNote(noteId) {
        onConfirmAction(
            "Delete Note",
            "Are you sure you want to delete this note?",
            async () => {
                try {
                    await request(`/notes?id=eq.${noteId}`, 'DELETE');

                    const updatedNotes = notes.filter(n => n.id !== noteId);
                    setNotes(updatedNotes);
                    onSaveNotes(collectionId, book.id, updatedNotes);

                    setActiveNote(null);
                    setIsEditing(false);
                    showNotification('Note deleted successfully!');
                } catch (error) {
                    showNotification(`Failed to delete note: ${error.message}`, 'error');
                }
            }
        );
    }

    return (
        <div
            className="modal-backdrop"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    setIsMouseDownOutside(true);
                } else {
                    setIsMouseDownOutside(false);
                }
            }}
            onClick={(e) => {
                if (isMouseDownOutside && e.target === e.currentTarget) {
                    onClose();
                }
                setIsMouseDownOutside(false);
            }}
        >
            <div className="modal-card notes-modal-card" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>✕</button>

                <h3 className="modal-title">Notes for "{book.title}"</h3>
                <p className="modal-author">Author: {book.author}</p>

                <div className="modal-notes-container">
                    {isCreating ? (
                        <form onSubmit={handleSaveNewNote} className="modal-notes-form">
                            <h4 className="notes-subtitle">Create New Note</h4>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Note title (e.g. Favorite Quote, Chapter 3)..."
                                value={titleInput}
                                onChange={(e) => setTitleInput(e.target.value)}
                                autoFocus
                                required
                            />
                            <textarea
                                className="form-input modal-notes-textarea"
                                placeholder="Write note content here..."
                                value={contentInput}
                                onChange={(e) => setContentInput(e.target.value)}
                                rows={6}
                                required
                            />
                            <div className="modal-notes-actions">
                                <button type="submit" className="form-btn">
                                    Save Note
                                </button>
                                <button
                                    type="button"
                                    className="form-btn shelf-btn-secondary"
                                    onClick={() => setIsCreating(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : activeNote ? (
                        <div className="modal-note-detail">
                            <button
                                type="button"
                                className="notes-back-btn"
                                onClick={() => { setActiveNote(null); setIsEditing(false); }}
                            >
                                ← Back to All Notes
                            </button>

                            {isEditing ? (
                                <div className="modal-notes-form">
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={titleInput}
                                        onChange={(e) => setTitleInput(e.target.value)}
                                        required
                                    />
                                    <textarea
                                        className="form-input modal-notes-textarea"
                                        value={contentInput}
                                        onChange={(e) => setContentInput(e.target.value)}
                                        rows={6}
                                        required
                                    />
                                    <div className="modal-notes-actions">
                                        <button type="button" className="form-btn" onClick={handleSaveEditedNote}>
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            className="form-btn shelf-btn-secondary"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="note-detail-card">
                                    <h4 className="note-detail-title">{activeNote.title}</h4>
                                    <div className="note-detail-content">{activeNote.content}</div>

                                    <div className="modal-notes-actions">
                                        <button
                                            type="button"
                                            className="form-btn shelf-btn-secondary"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="form-btn note-delete-btn"
                                            onClick={() => handleDeleteNote(activeNote.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="notes-list-wrapper">
                            <div className="notes-list-header">
                                <h4 className="notes-subtitle">All Notes ({notes.length})</h4>
                                <button
                                    type="button"
                                    className="form-btn notes-add-btn"
                                    onClick={handleStartCreate}
                                >
                                    + Create New Note
                                </button>
                            </div>

                            {notes.length === 0 ? (
                                <p className="empty-shelf-notice">No notes created for this book yet.</p>
                            ) : (
                                <div className="notes-cards-list">
                                    {notes.map((n) => (
                                        <div
                                            key={n.id}
                                            className="note-preview-item"
                                            onClick={() => handleOpenNote(n)}
                                        >
                                            <h5 className="note-preview-title">{n.title}</h5>
                                            <p className="note-preview-snippet">{n.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    className="form-btn shelf-btn-secondary modal-close-bottom-btn"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}