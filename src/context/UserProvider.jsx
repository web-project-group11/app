import { useState } from 'react'
import { UserContext } from './UserContext.jsx'
import axios from 'axios'

export default function UserProvider({ children }) {
    const apiUrl = import.meta.env.VITE_API_URL

    const userFromStorage = sessionStorage.getItem('authuser')
    const [ signupUser, setSignupUser ] = useState({ username: '', email: '', password: '', confirm_password: '' })
    const [ loginUser, setLoginUser ] = useState({ username: '', password: ''})
    const [ authUser, setAuthUser ] = useState(userFromStorage ? JSON.parse(userFromStorage) : {id: '', username: '', password: ''})

    const signUp = async () => {
        const headers = { headers: { 'Content-Type': 'application/json' } }
        await axios.post(`${apiUrl}/api/user/signup`, JSON.stringify({ user: signupUser }), headers)
        setSignupUser({ username: '', email: '', password: '', confirm_password: '' })
    }

    const logIn = async() => {
        const headers = {headers: {'Content-Type': 'application/json'}}
        const response = axios.post(`${apiUrl}/api/user/login`, JSON.stringify({ user: loginUser }), headers)
        setLoginUser(response.data)
        sessionStorage.setItem('authuser', JSON.stringify(response.data))
    }

    const logOut = async() => {
        //sessionstorage tietojen poisto ja palautus kotisivulle??
    }
    return (
        <UserContext.Provider value={{ authUser, setAuthUser, signupUser, setSignupUser, loginUser, setLoginUser, signUp, logIn, logOut }}>
            {children}
        </UserContext.Provider>
    )
}