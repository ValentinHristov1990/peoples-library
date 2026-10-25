import { Navigate, Outlet } from "react-router";
import useAuth from "../../Components/hooks/useAuth";

export default function GuestRoute() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to={"/shelf"} />;
    }
    return <Outlet />;
}