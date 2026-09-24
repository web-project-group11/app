import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./SimpleSearch.css";

const apiUrl = import.meta.env.VITE_API_URL;

function SimpleSearch() {
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchType, setSearchType] = useState("all");
    const [query, setQuery] = useState("");

    const search = async (e) => {
        e.preventDefault();
        setSearchParams({
            type: searchType,
            query: query,
            page: 1,
        });
        navigate(`/search?type=${searchType}&query=${query}&page=1`);
    }

    return (
        <div className="simple-search">
            <form id="search-form" onSubmit={search}>

                <div className="search-type">
                    <select
                        id="type-select"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="movie">Movies</option>
                        <option value="tv">TV-Series</option>
                    </select>
                </div>

                <input
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                <button type="submit" className="search-button">
                    <span></span>
                </button>

            </form>
        </div>
    )
}

export default SimpleSearch;