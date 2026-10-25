import { useEffect } from 'react';
import { Navigate } from 'react-router';
import useAuth from '../../Components/hooks/useAuth';


export default function Logout() {
    const { logout } = useAuth();

    useEffect(() => {
        logout();
    }, [logout]);

    return (
        <Navigate to={"/"} />
    );
}