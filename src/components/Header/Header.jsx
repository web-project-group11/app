import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../../context/useUser.jsx"
import { useState } from 'react'
import SimpleSearch from "../SimpleSearch.jsx"

import "./Header.css"

function Header() {

    const { authUser, logOut } = useUser()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = (e) => {
        e.preventDefault()
        setMenuOpen(false)
        logOut()
        navigate('/')
    }

    const handleGoToProfile = (e) => {
        e.preventDefault()
        setMenuOpen(false)
        navigate('/profile')
    }

    const handleGoToUserFavorites = (e) => {
        e.preventDefault()
        setMenuOpen(false)
        navigate(`/user/favorites/${authUser.username}`)
    }


    return (
        <header>
            <Link className="brand-link" to='/'>Movie App</Link>
            
            <div>
                <SimpleSearch />
            </div>
            <Link className="groups-link" to="/groups">
                <button className="groups-button" type="button">Groups</button>
            </Link>

            {authUser.token && (
                <>
                    <Link className="profile-link" to="/profile">
                        <span>{authUser.username}</span>
                    </Link>
                </>
            )}
            <div className="menu-container">

                <button
                    type="button"
                    className="hamburger"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {menuOpen && (
                    <div className="dropdown-menu">
                        {authUser.token ? (
                            <>
                                <span className="menu-username">
                                    {authUser.username}
                                </span>

                                <button onClick={handleGoToProfile}>
                                    Profile
                                </button>

                                <button onClick={handleGoToUserFavorites}>
                                    Favorites
                                </button>

                                <button onClick={handleLogout}>
                                    Log out
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setMenuOpen(false)}
                            >
                                Login
                            </Link>
                        )}
                    </div>
                )}

            </div>
        </header>
    )
}

export default Header