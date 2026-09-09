import { Link } from 'react-router-dom'
import NowPlayingSection from '../components/NowPlaying'

function HomePage() {
    return ( 
        <main>
            <div>
                <NowPlayingSection />
            </div>
        </main>
    )
}

export default HomePage