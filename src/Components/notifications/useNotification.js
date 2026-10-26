import { useContext } from 'react';
import { NotificationContext } from './NotificationContext';

export function useNotification() {
    return useContext(NotificationContext);
}
