import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Poster from '../Poster/Poster.jsx'
import './MovieCarousel.css'

const apiUrl = import.meta.env.VITE_API_URL

function MovieCarousel({ listType, title }) {
    const [movies, setMovies] = useState([])
    const [error, setError] = useState('')
    const [loadedListType, setLoadedListType] = useState(null)
    const [loadingMore, setLoadingMore] = useState(false)
    const [loadMoreError, setLoadMoreError] = useState('')
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)
    const carouselRef = useRef(null)
    const nextPageRef = useRef(2)
    const totalPagesRef = useRef(1)
    const loadingMoreRef = useRef(false)
    const requestVersionRef = useRef(0)
    const loading = loadedListType !== listType

    useEffect(() => {
        let isCurrent = true
        const requestVersion = ++requestVersionRef.current

        nextPageRef.current = 2
        totalPagesRef.current = 1
        loadingMoreRef.current = false

        axios.get(`${apiUrl}/api/movie/${listType}`, { params: { page: 1 } })
            .then(response => {
                if (isCurrent) {
                    const { results = [], page = 1, total_pages: totalPages = page } = response.data
                    setMovies(results)
                    nextPageRef.current = page + 1
                    totalPagesRef.current = totalPages
                    setError('')
                    setLoadingMore(false)
                    setLoadMoreError('')
                    setLoadedListType(listType)
                }
            })
            .catch(() => {
                if (isCurrent) {
                    setError('Movies could not be loaded.')
                    setLoadingMore(false)
                    setLoadMoreError('')
                    setLoadedListType(listType)
                }
            })

        return () => {
            isCurrent = false
            if (requestVersionRef.current === requestVersion) {
                requestVersionRef.current += 1
            }
        }
    }, [listType])

    const loadNextPage = async () => {
        if (loadingMoreRef.current || nextPageRef.current > totalPagesRef.current) return

        const requestedPage = nextPageRef.current
        const requestVersion = requestVersionRef.current
        loadingMoreRef.current = true
        setLoadingMore(true)
        setLoadMoreError('')

        try {
            const response = await axios.get(`${apiUrl}/api/movie/${listType}`, {
                params: { page: requestedPage },
            })

            if (requestVersion !== requestVersionRef.current) return

            const { results = [], page = requestedPage, total_pages: totalPages = page } = response.data
            setMovies(currentMovies => {
                const existingIds = new Set(currentMovies.map(movie => movie.id))
                return [...currentMovies, ...results.filter(movie => !existingIds.has(movie.id))]
            })
            nextPageRef.current = page + 1
            totalPagesRef.current = totalPages
        } catch {
            if (requestVersion === requestVersionRef.current) {
                setLoadMoreError('More movies could not be loaded.')
            }
        } finally {
            if (requestVersion === requestVersionRef.current) {
                loadingMoreRef.current = false
                setLoadingMore(false)
            }
        }
    }

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
            {loading ? (
                <p className="movie-carousel-message" role="status">Loading movies...</p>
            ) : error ? (
                <p className="movie-carousel-message" role="alert">{error}</p>
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
                    <div
                        className="movie-carousel-track"
                        ref={carouselRef}
                        aria-busy={loadingMore}
                        onScroll={event => {
                            const track = event.currentTarget
                            if (track.scrollLeft + track.clientWidth >= track.scrollWidth - track.clientWidth) {
                                loadNextPage()
                            }
                        }}
                    >
                        {movies.map(movie => (
                            <Poster key={movie.id} media={movie} mediaType="movie" />
                        ))}
                    </div>
                    {loadingMore && <p className="movie-carousel-load-status" role="status">Loading more movies...</p>}
                    {loadMoreError && (
                        <div className="movie-carousel-load-status" role="alert">
                            <span>{loadMoreError}</span>
                            <button type="button" onClick={loadNextPage}>Retry</button>
                        </div>
                    )}
                </div>
            ) : (
                <p className="movie-carousel-message">No movies found.</p>
            )}
        </section>
    )
}

export default MovieCarousel