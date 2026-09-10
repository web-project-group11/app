import { useNavigate, Link } from "react-router-dom"
import { useUser } from "../context/useUser.jsx"

function Login() {
    const navigate = useNavigate()
    const { loginUser, setLoginUser, logIn } = useUser()


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!loginUser.username.trim() || !loginUser.password.trim()){
            alert("username and password are required")
            return
        }

        logIn().then(response => {
            navigate('/')
        })
        .catch(error => {
            alert(error)
        })
    }
    

    return(
        <div>
            <h3>Login</h3>

            <form onSubmit={ handleSubmit }>
                <label>Username</label>
                <input
                    placeholder='Username'
                    value={loginUser.username}
                    onChange={e => setLoginUser({ ...loginUser, username: e.target.value })} 
                />
                
                <label>Password</label>
                <input
                    placeholder='Password'
                    type="password"
                    value={loginUser.password}
                    onChange={e => setLoginUser({ ...loginUser, password: e.target.value })} 
                />

                <button type='submit'>Log in</button>

                <Link to='/signup' onClick={() => setLoginUser({ username: '', password: '' })}>
                    No account? Signup
                </Link>
            </form>            
        </div>
    )
}

export default Login