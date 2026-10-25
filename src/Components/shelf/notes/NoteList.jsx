import NoteItem from './NoteItem';

export default function NoteList({ notes, onOpenNote, onStartCreate }) {
    return (
        <div className="notes-list-wrapper">
            <div className="notes-list-header">
                <h4 className="notes-subtitle">All Notes ({notes.length})</h4>
                <button
                    type="button"
                    className="form-btn notes-add-btn"
                    onClick={onStartCreate}
                >
                    + Create New Note
                </button>
            </div>

            {notes.length === 0 ? (
                <p className="empty-shelf-notice">No notes created for this book yet.</p>
            ) : (
                <div className="notes-cards-list">
                    {notes.map((n) => (
                        <NoteItem key={n.id} note={n} onClick={() => onOpenNote(n)} />
                    ))}
                </div>
            )}
        </div>
    );
}