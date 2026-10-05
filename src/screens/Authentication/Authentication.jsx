import { Navigate, Outlet } from 'react-router-dom'
import Header from '../../components/Header/Header.jsx'
import { useUser } from '../../context/useUser.jsx'

import './Authentication.css'

function Authentication() {
    const { authUser } = useUser()
    if (authUser?.token) {
        return <Navigate to={`/users/${authUser.username}`} replace />;
    }

    return (
        <div className="authentication-page">
            <Header />
            <div className="login-signup-container">
                <Outlet />
            </div>
        </div>
    )
}

export default Authentication