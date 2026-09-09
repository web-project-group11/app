import { Outlet, Link } from 'react-router-dom'

function Authentication() {
    // Tähän vois kirjottaa koodia mikä vie käyttäjän suoraan sen omaan profiiliin jos se on jo kirjautunut

    return (
        <div>
            <Link to='/'>App name</Link>
            <Outlet />
        </div>
    )
}

export default Authentication