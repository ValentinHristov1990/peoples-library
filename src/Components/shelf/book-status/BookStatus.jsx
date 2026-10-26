import { useState } from 'react';
import request from '../../utils/request';
import { useNotification } from '../../notifications/useNotification';
import { BOOK_STATUSES } from '../../../constants/bookStatusConst';
import './bookStatusStyle.css';

export default function BookStatus({ shelfBookId, currentStatus, onStatusUpdated }) {
    const { showNotification } = useNotification();
    const [status, setStatus] = useState(currentStatus || 'to-read');
    const [loading, setLoading] = useState(false);

    async function handleStatusChange(e) {
        const newStatus = e.target.value;
        setLoading(true);

        try {
            await request(`/shelf_books?id=eq.${shelfBookId}`, 'PATCH', {
                status: newStatus
            });

            setStatus(newStatus);
            if (onStatusUpdated) {
                onStatusUpdated(newStatus);
            }
            showNotification('Book status updated successfully!', 'success');
        } catch (error) {
            showNotification(`Failed to update status: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="book-status-wrapper">
            <label className="book-status-label">
                Reading Status:
            </label>
            <select
                className="form-input book-status-select"
                value={status}
                onChange={handleStatusChange}
                disabled={loading}
            >
                {BOOK_STATUSES.map(s => (
                    <option key={s.id} value={s.id}>
                        {s.icon} {s.label}
                    </option>
                ))}
            </select>
        </div>
    );
}