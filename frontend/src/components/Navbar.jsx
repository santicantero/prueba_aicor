import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Navbar() {
    const { user, logout } = useAuth()

    function handleGoogleLogin() {
        window.location.href = 'http://127.0.0.1:8000/api/auth/google/redirect'
    }

    let authSection = (
        <button onClick={handleGoogleLogin} className="flex min-w-[120px] cursor-pointer items-center justify-center gap-2 rounded-xl h-10 px-4 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
            <span className="material-symbols-outlined text-[18px]">login</span>
            <span className="truncate text-xs md:text-sm">Iniciar sesión</span>
        </button>
    )

    if (user != null) {
        let userAvatar = null
        if (user.avatar != null && user.avatar != "") {
            userAvatar = <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full shadow-sm" />
        }
        
        authSection = (
            <div className="flex items-center gap-4">
                {userAvatar}
                <span className="text-slate-900 dark:text-slate-100 text-sm font-bold hidden md:inline">{user.name}</span>
                <button onClick={logout} className="flex flex-col cursor-pointer items-center justify-center p-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all" title="Cerrar sesión">
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                </button>
            </div>
        )
    }

    return (
        <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-10 lg:px-40 py-3">
            <div className="flex items-center justify-between whitespace-nowrap">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-4 text-primary">
                        <div className="size-8 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">computer</span>
                        </div>
                        <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-[-0.015em]">AicorStore</h2>
                    </Link>
                    <nav className="hidden md:flex items-center gap-9">
                        <Link className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors" to="/">Productos</Link>
                        <Link className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors" to="/cart">Carrito</Link>
                        <Link className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors" to="/orders">Mis Pedidos</Link>
                    </nav>
                </div>
                <div className="flex flex-1 justify-end gap-4 md:gap-8 items-center">
                    {authSection}
                </div>
            </div>
        </header>
    )
}
