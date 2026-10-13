import { Navigate } from "react-router-dom";

export default function Logout({
    onLogout,
}) {
    onLogout();
    return (
        <Navigate to="/" />
    );
}