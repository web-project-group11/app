import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/useUser.jsx";
import { useState, useEffect, useRef } from "react";
import SimpleSearch from "../SimpleSearch/SimpleSearch.jsx";
import "./Header.css";

function Header() {
  const { authUser, logOut } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMenuOpen(false);
    }
  }

  const handleLogout = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    logOut();
    navigate("/");
  };

  const handleGoToSettings = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    navigate("/settings");
  };

  const handleGoToUserFavorites = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    navigate(`/users/${authUser.username}/favorites`)
  };

  return (
    <header className={`site-header${authUser.token ? " is-authenticated" : ""}`}>
      <Link className="brand-link" to="/">
        <img className="brand-logo" src="/favicon.svg" alt="" />
        <span className="brand-name">Movie App</span>
      </Link>

      <div className="header-search">
        <SimpleSearch />
      </div>

      {authUser.token ? (
        <>
          <Link className="groups-link" to="/groups">
            <button className="groups-button" type="button">
              Groups
            </button>
          </Link>
        </>
      ) : (
        <Link className="login-link" to="/login">
          <span>Login</span>
        </Link>
      )}
      <div className="menu-container" ref={menuRef}>
        <button
          type="button"
          className="hamburger"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {menuOpen && (
          <button
            type="button"
            className="menu-backdrop"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
        )}

        <div className={`dropdown-menu${menuOpen ? " is-open" : ""}`}>
          {menuOpen && (
            <>
              <div className="mobile-drawer-header">
                <span>Menu</span>
                <button type="button" onClick={() => setMenuOpen(false)}>
                  Close
                </button>
              </div>
              {authUser.token ? (
                <>
                  <Link
                    className="menu-username"
                    to={`/users/${authUser.username}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {authUser.username}
                  </Link>
                  <div className="mobile-menu-links">
                    <Link to="/groups" onClick={() => setMenuOpen(false)}>Groups</Link>
                  </div>
                <button onClick={handleGoToSettings}>Settings</button>
                <button onClick={handleGoToUserFavorites}>Favorites</button>
                <button onClick={handleLogout}>Log out</button>
                </>
              ) : (
                <button onClick={() => { setMenuOpen(false); navigate("/login"); }}>
                  Login
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
