import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/useUser.jsx";
import { useState } from "react";
import SimpleSearch from "../SimpleSearch.jsx";

import "./Header.css";

function Header() {
  const { authUser, logOut } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    logOut();
    navigate("/");
  };

  const handleGoToProfile = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    navigate("/profile");
  };

  const handleGoToUserFavorites = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    navigate(`/users/${authUser.username}/favorites`)
  };

  return (
    <header>
      <Link className="brand-link" to="/">
        Movie App
      </Link>

      <div>
        <SimpleSearch />
      </div>

      {authUser.token ? (
        <>
          <Link className="groups-link" to="/groups">
            <button className="groups-button" type="button">
              Groups
            </button>
          </Link>
          <Link className="profile-link" to={`/users/${authUser.username}`}>
            <span>{authUser.username}</span>
          </Link>
        </>
      ) : (
        <Link className="login-link" to="/login">
          <span>Login</span>
        </Link>
      )}
      {authUser.token && (
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

          <div className="dropdown-menu">
            {menuOpen && (
              <>
                <span className="menu-username">{authUser.username}</span>
                <button onClick={handleGoToProfile}>Profile</button>
                <button onClick={handleGoToUserFavorites}>Favorites</button>
                <button onClick={handleLogout}>Log out</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
