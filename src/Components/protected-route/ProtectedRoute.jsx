import { useContext } from "react";
import AuthContext from "../../context/authContext";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
    const { isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated) {
        return <Navigate to={"/shelf"} />
    }
    return <Outlet />;;
}
