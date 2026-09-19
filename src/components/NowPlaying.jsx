import { useEffect, useState } from 'react'
import axios from 'axios'
import Poster from '../components/Poster.jsx'

const apiUrl = import.meta.env.VITE_API_URL

function NowPlayingSection() {
    const [movies, setMovies] = useState([])

    useEffect(() => {
        axios.get(`${apiUrl}/api/movie/now-playing`)
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
                {movies.map((media) => (
                    <Poster media={media} key={media.id} mediaType={"movie"} />
                ))}
            </div>
        </section>
    )
}

export default NowPlayingSection
