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
                        <a href="/">Home</a>
                        <a href="/search">Search movies</a>
                        <a href="/groups">Groups</a>
                    </div>

                    <div>
                        <h3>Info</h3>
                        <a href="/about">About</a>
                        <a href="/contact">Contact</a>
                        <a href="/privacy">Privacy</a>
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