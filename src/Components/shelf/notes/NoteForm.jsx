import { useState } from 'react';

export default function NoteForm({
    initialTitle = '',
    initialContent = '',
    onSubmit,
    onCancel,
    submitText = "Save Note",
    titlePlaceholder = "Note title (e.g. Favorite Quote, Chapter 3)...",
    contentPlaceholder = "Write note content here..."
}) {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;
        onSubmit({ title: title.trim(), content: content.trim() });
    };

    return (
        <form onSubmit={handleSubmit} className="modal-notes-form">
            <input
                type="text"
                className="form-input"
                placeholder={titlePlaceholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                required
            />
            <textarea
                className="form-input modal-notes-textarea"
                placeholder={contentPlaceholder}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                required
            />
            <div className="modal-notes-actions">
                <button type="submit" className="form-btn">
                    {submitText}
                </button>
                <button
                    type="button"
                    className="form-btn shelf-btn-secondary"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}