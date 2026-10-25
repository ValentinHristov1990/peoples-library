import './confirmModalStyle.css';

export default function ConfirmModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Delete",
}) {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop confirm-backdrop" onClick={onCancel}>
            <div className="modal-card confirm-modal-card" onClick={(e) => e.stopPropagation()}>
                <h3 className="confirm-modal-title">{title || "Confirm Action"}</h3>
                <p className="confirm-modal-message">{message}</p>

                <div className="confirm-modal-actions">
                    <button
                        type="button"
                        className="form-btn shelf-btn-secondary"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="form-btn danger-btn"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}