import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../../context/useUser.jsx"
import SimpleSearch from "../SimpleSearch.jsx"

import "./Header.css"

function Header() {

    const { authUser, logOut } = useUser()
    const navigate = useNavigate()

    const handleLogout = (e) => {
        e.preventDefault()
        logOut()
        navigate('/')
    }

    const handleGoToProfile = (e) => {
        e.preventDefault()
        navigate('/profile')
    }

    const handleGoToUserFavorites = (e) => {
        e.preventDefault()
        navigate(`/user/favorites/${authUser.username}`)
    }

    return (
        <header>
            <Link to='/'>App name</Link>

            <Link to="/search">
                <button type="button">Search</button>
            </Link>

            <Link to="/groups">
                <button type="button">Groups</button>
            </Link>

            {authUser.token ? (
                <>
                    <span>Signed in as {authUser.username}</span>
                    <button type="button" onClick={handleLogout}>Log out</button>
                    <button type="button" onClick={handleGoToUserFavorites}>Favorites</button>
                </>
            ) : (
                <Link to="/login">
                    <button type="button">Login</button>
                </Link>
            )
            }
            {authUser.token ? (
                <>
                <button type="button" onClick={handleGoToProfile}>Profile</button>
                </>
            ) : (
                <span></span>
            )}

            <div>
                <SimpleSearch />
            </div>
        </header>
    )
}

export default Header