import NowPlayingSection from '../components/NowPlaying'

function HomePage() {
    return ( 
        <main>
            <div>
                <h1>Movie App</h1>

                <Link to="/search">
                    <button type="button">Search</button>
                </Link>

                <NowPlayingSection />
            </div>
        </main>
    )
}