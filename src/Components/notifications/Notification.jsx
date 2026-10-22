import { createContext, useContext, useState } from 'react';
import './notification.css';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = 'success', duration) => {
        const defaultDuration = type === 'error' ? 4000 : 3000;
        const timeToLive = duration || defaultDuration;

        setNotification({ message, type });

        setTimeout(() => {
            setNotification(null);
        }, timeToLive);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
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

export function useNotification() {
    return useContext(NotificationContext);
}