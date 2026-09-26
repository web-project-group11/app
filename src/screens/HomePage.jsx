import MovieCarousel from '../components/MovieCarousel/MovieCarousel'

function HomePage() {
    return ( 
        <main>
            <div>
                <MovieCarousel listType="now-playing" title="Now Playing" />
                <MovieCarousel listType="top-rated" title="Top Rated" />
            </div>
        </main>
    )
}

export default HomePage