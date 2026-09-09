import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../context/useUser.jsx"

function SignUp() {
    const { user, setUser, signUp } = useUser()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!user.username.trim()) {
            alert('Username is required')
            return
        }

        if (!user.email.trim()) {
            alert('Email is required')
            return
        }

        if (!user.password) {
            alert('Password is required')
            return
        }

        if (user.password !== user.confirm_password) {
            alert('Passwords do not match')
            return
        }

        signUp().then(response => {
            console.log(response)
            //navigate(authenticationMode === AuthenticationMode.SignUp ? '/login' : '/')
        })
        .catch(error => {
            alert(error)
        })
    }

    return(
        <div>
            <h3>Sign up</h3>

            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input
                    placeholder='Username'
                    value={user.username}
                    onChange={e => setUser({ ...user, username: e.target.value })} 
                />

                <label>Email</label>
                <input
                    placeholder='Email'
                    value={user.email}
                    onChange={e => setUser({ ...user, email: e.target.value })} 
                />

                <label>Password</label>
                <input
                    placeholder='Password'
                    type='password' value={user.password}
                    onChange={e => setUser({ ...user, password: e.target.value })}
                />

                <label>Confirm password</label>
                <input
                    placeholder='Confirm password'
                    type='password' value={user.confirm_password}
                    onChange={e => setUser({ ...user, confirm_password: e.target.value })}
                />

                <button type='submit'>Sign up</button>

                <Link to='/login' onClick={() => setUser({ username: '', email: '', password: '', confirm_password: '' })}>
                    Already have an account? Login
                </Link>
            </form>
        </div>
    )
}

export default SignUp