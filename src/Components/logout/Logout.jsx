import { useEffect } from 'react';
import { Navigate } from 'react-router';
import useAuth from '../../hooks/useAuth';


export default function Logout() {
    const { logout } = useAuth();

    useEffect(() => {
        logout().catch(err => console.error("Logout background error:", err));
    }, [logout]);

    return (
        <Navigate to="/" replace />
    );
}