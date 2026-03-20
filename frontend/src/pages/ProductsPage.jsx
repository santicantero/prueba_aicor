import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HeroSection from '../components/HeroSection'
import ProductCard from '../components/ProductCard'

export default function ProductsPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Todos')
    
    const { user } = useAuth()
    const { addToCart } = useCart()

    async function handleAddToCart(productId) {
        if (user == null) {
            alert('Debes iniciar sesión para añadir productos al carrito')
            return
        }
        
        const ok = await addToCart(productId, 1)
        
        if (ok) {
            alert('Producto añadido al carrito')
        } else {
            alert('No se pudo añadir el producto al carrito')
        }
    }

    useEffect(function() {
        setLoading(true)
        setError("")

        async function loadProducts() {
            try {
                const res = await fetch("http://127.0.0.1:8000/api/products")
                if (res.ok) {
                    const data = await res.json()
                    setProducts(data)
                } else {
                    setError("Error HTTP: " + res.status)
                }
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        
        loadProducts()
    }, [])

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex flex-1 flex-col px-4 md:px-10 lg:px-40 py-8">
                <HeroSection />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <h2 className="text-slate-900 dark:text-slate-100 text-2xl md:text-3xl font-extrabold tracking-tight">Productos Destacados</h2>
                    
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                        {/* Buscador */}
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                            <input 
                                type="search" 
                                placeholder="Buscar componente..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 w-full sm:w-64 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                            />
                        </div>

                        {/* Filtros Categorías */}
                        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                            {['Todos', 'periferico', 'ordenador', 'dron'].map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap capitalize transition-colors ${
                                        selectedCategory === cat 
                                        ? 'bg-primary text-white shadow-md shadow-primary/20' 
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {cat === 'periferico' ? 'Periféricos' : cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20 text-xl font-medium text-slate-500">Cargando productos...</div>
                ) : error !== "" ? (
                    <div className="flex justify-center items-center py-20 text-xl font-medium text-red-500">Error: {error}</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products
                            .filter(p => {
                                const matchCat = selectedCategory === 'Todos' || p.categoria === selectedCategory;
                                const matchSearch = p.nombre.toLowerCase().includes(searchQuery.toLowerCase());
                                return matchCat && matchSearch;
                            })
                            .map(producto => (
                            <ProductCard 
                                key={producto.id} 
                                producto={producto} 
                                onAddToCart={handleAddToCart} 
                            />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
