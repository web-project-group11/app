import { useState } from 'react'
import { UserContext } from './UserContext.jsx'
import axios from 'axios'

export default function UserProvider({ children }) {
    const apiUrl = import.meta.env.VITE_API_URL

    const userFromStorage = sessionStorage.getItem('user')
    const [user, setUser] = useState(userFromStorage ? JSON.parse(userFromStorage) : { username: '', email: '', password: '', confirm_password: '' })

    const signUp = async () => {
        const headers = { headers: { 'Content-Type': 'application/json' } }
        await axios.post(`${apiUrl}/api/user/signup`, JSON.stringify({ user: user }), headers)
        setUser({ username: '', email: '', password: '', confirm_password: '' })
    }

    return (
        <UserContext.Provider value={{ user, setUser, signUp }}>
            {children}
        </UserContext.Provider>
    )
}