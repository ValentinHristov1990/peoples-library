import { useCallback, useMemo, useState } from 'react';
import { NotificationContext } from './NotificationContext';
import './notification.css';

export function NotificationProvider({ children }) {
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback((message, type = 'success', duration) => {
        const defaultDuration = type === 'error' ? 4000 : 3000;
        const timeToLive = duration || defaultDuration;

        setNotification({ message, type });

        setTimeout(() => {
            setNotification(null);
        }, timeToLive);
    }, []);
    const value = useMemo(() => ({ showNotification }), [showNotification]);

    return (
        <NotificationContext.Provider value={value}>
            {children}
            {notification && (
                <div className="notification-container">
                    <div className={`notification-message notification-${notification.type}`}>
                        <span>{notification.type === 'success' ? '✓' : '✕'}</span>
                        <span>{notification.message}</span>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
}