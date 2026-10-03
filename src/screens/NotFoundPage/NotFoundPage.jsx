import "./NotFoundPage.css"

export default function NotFoundPage() {
    return (
        <div className="not-found-page">
            <h2>404 - Page not found</h2>
            <button onClick={() => window.location.href = "/"}>Go to Home</button>
        </div>
    )
}