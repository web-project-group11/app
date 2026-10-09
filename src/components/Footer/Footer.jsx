import { Link } from 'react-router-dom'

import './Footer.css'

function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <h2>Movie App</h2>
                    <p>Find movies, share reviews, and enjoy them together.</p>
                </div>

                <nav className="footer-links" aria-label="Footer navigation">
                    <div>
                        <h3>Explore</h3>
                        <Link to="/">Home</Link>
                        <Link to="/search">Search movies</Link>
                        <Link to="/groups">Groups</Link>
                    </div>

                    <div>
                        <h3>Info</h3>
                        <Link to="/about">About</Link>
                        <Link to="/contact">Contact</Link>
                        <Link to="/privacy">Privacy</Link>
                    </div>
                </nav>
            </div>

            <div className="footer-bottom">
                <span>&copy; {new Date().getFullYear()} Movie App</span>
                <span>Built for movie fans</span>
            </div>
        </footer>
    )
}

export default Footer