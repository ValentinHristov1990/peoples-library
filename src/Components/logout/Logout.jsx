import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function Logout({ onLogout }) {
    useEffect(() => {
        onLogout();
    }, [onLogout]);

    return <Navigate to="/" />;
}