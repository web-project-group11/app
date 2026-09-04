import genres from "../helper/Genres.js"

export default function Row({ movie }) {

    const genreNames = movie.genre_ids.map((id) => {
        const genre = genres.find((g) => g.id === id);
        return genre ? genre.name : "Unknown";
    });

    return (
            <tr>
                <td>{movie.title}</td>
                <td>{genreNames.length === 0 ? "N/A" : genreNames.sort().join(", ")}</td>
                <td>{movie.release_date ? movie.release_date.substring(0, 4) : "N/A"}</td>
            </tr>
    )
}