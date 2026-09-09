import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../context/useUser.jsx"

function Header() {

    const { authUser, logOut } = useUser()
    const navigate = useNavigate()

    const handleLogout = (e) => {
        e.preventDefault()
        logOut()
        navigate('/')
    }

    return (
        <div>
            <Link to='/'>App name</Link>

            <Link to="/search">
                <button type="button">Search</button>
            </Link>
            {authUser.token ? (
                <>
                    <span>Signed in as {authUser.username}</span>
                    <button type="button" onClick={handleLogout}>Log out</button>
                </>
            ) : (
                <Link to="/login">
                    <button type="button">Login</button>
                </Link>
            )}


        </div>
    )
}

export default Header