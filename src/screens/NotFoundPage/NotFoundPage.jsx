import { useNavigate } from "react-router-dom"
import Header from "../../components/Header/Header.jsx"

import "./NotFoundPage.css"

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <div className="not-found-page">
                <h2>404 - Page not found</h2>
                <button onClick={() => navigate("/")}>Homepage</button>
            </div>
        </>
    )
}