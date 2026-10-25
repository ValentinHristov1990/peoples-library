export default function NoteItem({ note, onClick }) {
    return (
        <div className="note-preview-item" onClick={onClick}>
            <h5 className="note-preview-title">{note.title}</h5>
            <p className="note-preview-snippet">{note.content}</p>
        </div>
    );
}