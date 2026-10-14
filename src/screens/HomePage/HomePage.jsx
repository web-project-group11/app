import MovieCarousel from '../../components/MovieCarousel/MovieCarousel';

function HomePage() {
    return ( 
        <main>
            <div>
                <MovieCarousel listType="now-playing" title="Now in theaters" />
                <MovieCarousel listType="top-rated" title="Top rated" />
            </div>
        </main>
    );
}

export default HomePage;