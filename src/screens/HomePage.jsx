import { Link } from 'react-router-dom'
import NowPlayingSection from '../components/NowPlaying'

function HomePage() {
    return ( 
        <main>
            <div>
                <form></form>
                <h1>Movie App</h1>

                <Link to="/search">
                    <button type="button">Search</button>
                </Link>

                <NowPlayingSection />
            </div>
        </main>
    )
}

export default HomePage