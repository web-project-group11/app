import { useCallback, useState, useEffect } from 'react'
import { UserContext } from './UserContext.jsx'
import axios from 'axios'

export default function UserProvider({ children }) {
    const apiUrl = import.meta.env.VITE_API_URL

    const userFromStorage = sessionStorage.getItem('authuser')
    const [ signupUser, setSignupUser ] = useState({ username: '', email: '', password: '', confirm_password: '' })
    const [ loginUser, setLoginUser ] = useState({ username: '', password: ''})
    const [ authUser, setAuthUser ] = useState(userFromStorage ? JSON.parse(userFromStorage) : {id: '', username: '', token: ''})

    const signUp = async () => {
        const headers = { headers: { 'Content-Type': 'application/json' } }
        await axios.post(`${apiUrl}/api/user/signup`, JSON.stringify({ user: signupUser }), headers)
        setSignupUser({ username: '', email: '', password: '', confirm_password: '' })
    }

    const logIn = async() => {
        const headers = {headers: {'Content-Type': 'application/json'}}
        const response = await axios.post(`${apiUrl}/api/user/login`, JSON.stringify({ user: loginUser }), headers)
        // login endpoint returns JSON in this format: {id: '', username: '', token: ''}
        setAuthUser(response.data)
        sessionStorage.setItem('authuser', JSON.stringify(response.data))
        setLoginUser({ username: '', password: '' })
    }

    const logOut = useCallback(() => {
        sessionStorage.removeItem('authuser')
        setAuthUser({ id: '', username: '', token: ''})
    }, [])

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401) {
                    logOut()
                }

                return Promise.reject(error)
            }
        )

        return () => {
            axios.interceptors.response.eject(interceptor)
        }
    }, [logOut])

    return (
        <UserContext.Provider value={{ authUser, setAuthUser, signupUser, setSignupUser, loginUser, setLoginUser, signUp, logIn, logOut }}>
            {children}
        </UserContext.Provider>
    )
}