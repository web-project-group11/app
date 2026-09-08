import { Link } from "react-router-dom"

function Header() {
    return (
        <div>
            <h1>App name</h1>
            <Link to='/login'></Link>
        </div>
    )
}

export default Header