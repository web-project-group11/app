import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Poster from '../Poster/Poster.jsx'
import './MovieCarousel.css'

const apiUrl = import.meta.env.VITE_API_URL

function MovieCarousel({ listType, title }) {
    const [movies, setMovies] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)
    const carouselRef = useRef(null)

    useEffect(() => {
        let isCurrent = true

        setLoading(true)
        setError('')
        axios.get(`${apiUrl}/api/movie/${listType}`)
            .then(response => {
                if (isCurrent) setMovies(response.data.results ?? [])
            })
            .catch(() => {
                if (isCurrent) setError('Movies could not be loaded.')
            })
            .finally(() => {
                if (isCurrent) setLoading(false)
            })

        return () => {
            isCurrent = false
        }
    }, [listType])

    useEffect(() => {
        const track = carouselRef.current
        if (!track) return

        const updateScrollButtons = () => {
            const firstMovie = track.firstElementChild?.getBoundingClientRect()
            const lastMovie = track.lastElementChild?.getBoundingClientRect()
            const visibleLeft = track.getBoundingClientRect().left + track.clientLeft
            const visibleRight = visibleLeft + track.clientWidth

            setCanScrollLeft(Boolean(firstMovie && firstMovie.left < visibleLeft - 1))
            setCanScrollRight(Boolean(lastMovie && lastMovie.right > visibleRight + 1))
        }

        updateScrollButtons()
        track.addEventListener('scroll', updateScrollButtons)
        const resizeObserver = new ResizeObserver(updateScrollButtons)
        resizeObserver.observe(track)

        return () => {
            track.removeEventListener('scroll', updateScrollButtons)
            resizeObserver.disconnect()
        }
    }, [movies])

    const scrollMovies = (direction) => {
        carouselRef.current?.scrollBy({
            left: direction * carouselRef.current.clientWidth * 0.8,
            behavior: 'smooth',
        })
    }

    return (
        <section className="movie-carousel" aria-labelledby={`movie-carousel-${listType}-title`}>
            <header className="movie-carousel-header">
                <h2 id={`movie-carousel-${listType}-title`}>{title}</h2>
            </header>
            {error ? (
                <p className="movie-carousel-message" role="alert">{error}</p>
            ) : loading ? (
                <p className="movie-carousel-message" role="status">Loading movies...</p>
            ) : movies.length ? (
                <div className={`movie-carousel-content${canScrollLeft ? ' has-scroll-left' : ''}${canScrollRight ? ' has-scroll-right' : ''}`}>
                    <button
                        type="button"
                        className={`movie-carousel-scroll-button is-left${canScrollLeft ? ' is-visible' : ''}`}
                        aria-label={`Scroll ${title} movies left`}
                        aria-hidden={!canScrollLeft}
                        tabIndex={canScrollLeft ? 0 : -1}
                        disabled={!canScrollLeft}
                        onClick={() => scrollMovies(-1)}
                    >
                        &larr;
                    </button>
                    <button
                        type="button"
                        className={`movie-carousel-scroll-button is-right${canScrollRight ? ' is-visible' : ''}`}
                        aria-label={`Scroll ${title} movies right`}
                        aria-hidden={!canScrollRight}
                        tabIndex={canScrollRight ? 0 : -1}
                        disabled={!canScrollRight}
                        onClick={() => scrollMovies(1)}
                    >
                        &rarr;
                    </button>
                    <div className="movie-carousel-track" ref={carouselRef}>
                        {movies.map(movie => (
                            <Poster key={movie.id} media={movie} mediaType="movie" />
                        ))}
                    </div>
                </div>
            ) : (
                <p className="movie-carousel-message">No movies found.</p>
            )}
        </section>
    )
}

export default MovieCarousel