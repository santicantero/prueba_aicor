import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AuthCallback() {
    const navigate = useNavigate()
    const { login } = useAuth()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)

        const token = params.get('token')
        const name = params.get('name')
        const email = params.get('email')
        const avatar = params.get('avatar')
        const is_admin = params.get('is_admin') === '1'

        if (token) {
            login(token, {
                name,
                email,
                avatar,
                is_admin,
            })

            window.history.replaceState({}, document.title, '/auth/callback')
            navigate('/')
        } else {
            navigate('/')
        }
    }, [login, navigate])

    return <h1>Procesando login...</h1>
}

export default AuthCallback