import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

function Login() {
    const navigate = useNavigate()

    useEffect(() => {
        // temp että login nappi vie suoraan signup sivulle koska login sivua ei oo vielä, saa poistaa
        navigate('/signup')
    }) 

    return(
        <div>
            
        </div>
    )
}

export default Login