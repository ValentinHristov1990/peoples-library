import { useState, useEffect } from 'react';
import NoteList from './NoteList';
import NoteForm from './NoteForm';
import NoteDeleteButton from './NoteDeleteButton';
import request from '../../utils/request';
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

    const [notes, setNotes] = useState(book.notes || []);
    const [activeNote, setActiveNote] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isMouseDownOutside, setIsMouseDownOutside] = useState(false);

    useEffect(() => {
        setNotes(book.notes || []);
        setActiveNote(null);
        setIsCreating(false);
        setIsEditing(false);
    }, [book]);

    function handleStartCreate() {
        setIsCreating(true);
        setActiveNote(null);
        setIsEditing(false);
    }

    function handleOpenNote(note) {
        setActiveNote(note);
        setIsCreating(false);
        setIsEditing(false);
    }

    async function handleSaveNewNote({ title, content }) {
        try {
            const data = await request('/notes', 'POST', {
                book_id: book.id,
                user_id: user.id,
                title,
                content
            });

            const createdNote = Array.isArray(data) ? data[0] : data;
            const newNote = createdNote || {
                id: Date.now(),
                title,
                content
            };

            const updatedNotes = [...notes, newNote];
            setNotes(updatedNotes);
            onSaveNotes(collectionId, book.id, updatedNotes);

            setIsCreating(false);
            handleOpenNote(newNote);
        } catch (error) {
            console.error(`Failed to create note: ${error.message}`);
        }
    }

    async function handleSaveEditedNote({ title, content }) {
        try {
            await request(`/notes?id=eq.${activeNote.id}`, 'PATCH', {
                title,
                content
            });

            const updatedNotes = notes.map(n => {
                if (n.id === activeNote.id) {
                    return { ...n, title, content };
                }
                return n;
            });

            setNotes(updatedNotes);
            onSaveNotes(collectionId, book.id, updatedNotes);

            setActiveNote({ ...activeNote, title, content });
            setIsEditing(false);
        } catch (error) {
            console.error(`Failed to update note: ${error.message}`);
        }
    }

    function handleDeleteSuccess(noteId) {
        const updatedNotes = notes.filter(n => n.id !== noteId);
        setNotes(updatedNotes);
        onSaveNotes(collectionId, book.id, updatedNotes);
        setActiveNote(null);
        setIsEditing(false);
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
                        <div>
                            <h4 className="notes-subtitle">Create New Note</h4>
                            <NoteForm
                                onSubmit={handleSaveNewNote}
                                onCancel={() => setIsCreating(false)}
                                submitText="Save Note"
                            />
                        </div>
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
                                <div>
                                    <h4 className="notes-subtitle">Edit Note</h4>
                                    <NoteForm
                                        initialTitle={activeNote.title}
                                        initialContent={activeNote.content}
                                        onSubmit={handleSaveEditedNote}
                                        onCancel={() => setIsEditing(false)}
                                        submitText="Save Changes"
                                    />
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
                                        <NoteDeleteButton
                                            noteId={activeNote.id}
                                            onDeleteSuccess={handleDeleteSuccess}
                                            onConfirmAction={onConfirmAction}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <NoteList
                            notes={notes}
                            onOpenNote={handleOpenNote}
                            onStartCreate={handleStartCreate}
                        />
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