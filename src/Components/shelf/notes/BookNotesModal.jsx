import { useState, useEffect } from 'react';

export default function BookNotesModal({
    isOpen,
    book,
    collectionId,
    onClose,
    onSaveNote
}) {
    if (!isOpen || !book) return null;

    const [noteText, setNoteText] = useState(book.note || '');
    const [isEditing, setIsEditing] = useState(!book.note);

    useEffect(() => {
        setNoteText(book.note || '');
        setIsEditing(!book.note);
    }, [book]);

    function handleSave() {
        onSaveNote(collectionId, book.id, noteText.trim());
        setIsEditing(false);
    }

    function handleDeleteNote() {
        onSaveNote(collectionId, book.id, '');
        setNoteText('');
        setIsEditing(true);
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>✕</button>

                <h3 className="modal-title">Notes for "{book.title}"</h3>
                <p className="modal-author">Author: {book.author}</p>

                <div className="modal-notes-section">
                    {isEditing ? (
                        <div className="modal-notes-form">
                            <textarea
                                className="form-input modal-notes-textarea"
                                placeholder="Write your personal thoughts, favorite quotes, or review..."
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                rows={5}
                                autoFocus
                            />
                            <div className="modal-notes-actions">
                                <button type="button" className="form-btn" onClick={handleSave}>
                                    Save Note
                                </button>
                                {book.note && (
                                    <button
                                        type="button"
                                        className="form-btn shelf-btn-secondary"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="modal-notes-display">
                            <p className="modal-notes-content">"{book.note}"</p>
                            <div className="modal-notes-actions">
                                <button
                                    type="button"
                                    className="form-btn shelf-btn-secondary"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Note
                                </button>
                                <button
                                    type="button"
                                    className="form-btn shelf-btn-secondary"
                                    onClick={handleDeleteNote}
                                >
                                    Delete Note
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    className="form-btn shelf-btn-secondary"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}