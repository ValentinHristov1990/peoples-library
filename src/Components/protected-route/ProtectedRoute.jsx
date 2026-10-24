import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/authContext";

export default function ProtectedRoute() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to={"/shelf"} />
    }
    return <Outlet />;;
}
