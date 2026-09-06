import { useEffect, useState } from 'react'
import axios from 'axios'
import Poster from '../components/Poster.jsx'

const apiUrl = import.meta.env.VITE_API_URL

function NowPlayingSection() {
    const [movies, setMovies] = useState([])

    useEffect(() => {
        axios.get(`${apiUrl}/api/now-playing`)
            .then(response => {
                setMovies(response.data.results)
            })
            .catch(error => {
                alert(error.response.data ? error.response.data.message : error)
            })
    }, [])

    return (
        <section>
            <h2>Now Playing</h2>
            <div className="now-playing-row">
                {movies.map((movie) => (
                    <Poster movie={movie} key={movie.id} />
                ))}
            </div>
        </section>
    )
}

export default NowPlayingSection
