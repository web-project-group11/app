import { Outlet, Link } from 'react-router-dom'
import Header from '../../components/Header/Header.jsx'

import './Authentication.css'

function Authentication() {
    // Tähän vois kirjottaa koodia mikä vie käyttäjän suoraan sen omaan profiiliin jos se on jo kirjautunut
    //useEffect(() => {
    //    
    //}, [])

    return (
        <div className="authentication-page">
            <Header />
            <div className="login-signup-container">
                <Outlet />
            </div>
        </div>
    )
}

export default Authentication