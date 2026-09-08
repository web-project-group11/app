import { Link, useNavigate } from "react-router-dom"

export const AuthenticationMode = Object.freeze({
    Login: 'Login',
    SignUp: 'SignUp'
})

function Authentication(authenticationMode) {
    return(
        <>
            <Link to='/'>App name</Link>
            
        </>
    )
}

export default Authentication