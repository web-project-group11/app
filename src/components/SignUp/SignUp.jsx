import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../../context/useUser.jsx"

import './SignUp.css'

function SignUp() {
    const { signupUser, setSignupUser, signUp } = useUser()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!signupUser.username.trim()) {
            alert('Username is required')
            return
        }

        if (!signupUser.email.trim() || !signupUser.email.includes('@')) {
            alert('A valid email address is required')
            return
        }

        if (!signupUser.password) {
            alert('Password is required')
            return
        }

        const numRegex = /\d/
        const uppercaseRegex = /[A-Z]/
        if (signupUser.password.length < 8 || !numRegex.test(signupUser.password) || !uppercaseRegex.test(signupUser.password)) {
            console.log(signupUser.password.length)
            alert('Password has to be at least 8 characters long, contain at least one uppercase letter and contain at least one number')
            return
        }

        if (signupUser.password !== signupUser.confirm_password) {
            alert('Passwords do not match')
            return
        }

        signUp().then(response => {
            navigate('/login')
        })
        .catch(error => {
            alert(error)
        })
    }

    return(
        <div className="signup-container">
            <h3>Sign up</h3>

            <form className="form" onSubmit={handleSubmit}>
                <label>Username</label>
                <input
                    placeholder='Username'
                    value={signupUser.username}
                    onChange={e => setSignupUser({ ...signupUser, username: e.target.value })} 
                />

                <label>Email</label>
                <input
                    placeholder='Email'
                    value={signupUser.email}
                    onChange={e => setSignupUser({ ...signupUser, email: e.target.value })} 
                />

                <label>Password</label>
                <input
                    placeholder='Password'
                    type='password' value={signupUser.password}
                    onChange={e => setSignupUser({ ...signupUser, password: e.target.value })}
                />

                <label>Confirm password</label>
                <input
                    placeholder='Confirm password'
                    type='password' value={signupUser.confirm_password}
                    onChange={e => setSignupUser({ ...signupUser, confirm_password: e.target.value })}
                />

                <button type='submit'>Sign up</button>

                <Link to='/login' onClick={() => setSignupUser({ username: '', email: '', password: '', confirm_password: '' })}>
                    Already have an account? Login
                </Link>
            </form>
        </div>
    )
}

export default SignUp