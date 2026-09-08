import { Link } from "react-router-dom"

function Header() {
    return (
        <div>
            <Link to='/'>App name</Link>

            <Link to="/search">
                <button type="button">Search</button>
            </Link>

            <Link to='/login'>Login</Link>
        </div>
    )
}

export default Header