import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/authContext";

export default function GuestRoute() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to={"/shelf"} />;
    }
    return <Outlet />;
}