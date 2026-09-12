import { useUser } from '../context/useUser'
import { Outlet,Navigate } from 'react-router-dom'

export default function ProtectedRoute() {
    const { authUser } = useUser();

    if (!authUser || !authUser?.token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}