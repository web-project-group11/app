import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Poster from "../components/Poster.jsx";

const apiUrl = import.meta.env.VITE_API_URL;

function SimpleSearch() {
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchType, setSearchType] = useState("all");
    const [query, setQuery] = useState("");
    const [result, setResult] = useState([]);

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
                <select
                    id="type-select"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="movie">Movies</option>
                    <option value="tv">TV-Series</option>
                </select>

                <input
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </form>
        </div>
    );
}

export default SimpleSearch;