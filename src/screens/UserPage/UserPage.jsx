import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL

function UserPage() {
    const { username } = useParams()
    const { user, setUser } = useState({})

    useEffect(() => {
        // get user by username
    }, [username])

    return (
        <h1>{username}</h1>
    )
}

export default UserPage