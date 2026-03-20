import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductImage from '../components/ProductImage'

export default function ProductDetailPage() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [mainImage, setMainImage] = useState("")
    
    const { user } = useAuth()
    const { addToCart } = useCart()

    // Usaremos la misma imagen para toda la galería como ha pedido el usuario
    const galleryImages = [mainImage, mainImage, mainImage, mainImage]

    useEffect(function() {
        setLoading(true)
        setError("")

        async function loadProduct() {
            try {
                // Fetch de todos los productos porque el backend no tiene endpoint individual por ahora
                const res = await fetch("http://127.0.0.1:8000/api/products")
                if (res.ok) {
                    const data = await res.json()
                    const foundProduct = data.find(p => p.id === parseInt(id))
                    
                    if (foundProduct) {
                        setProduct(foundProduct)
                        // Use the ProductImage component's logic indirectly or just trust the URL
                        setMainImage(foundProduct.imagen_url || "")
                    } else {
                        setError("Producto no encontrado")
                    }
                } else {
                    setError("Error HTTP: " + res.status)
                }
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        
        loadProduct()
    }, [id])

    async function handleAddToCart() {
        if (user == null) {
            alert('Debes iniciar sesión para añadir productos al carrito')
            return
        }
        
        const ok = await addToCart(product.id, 1)
        
        if (ok) {
            alert('Producto añadido al carrito')
        } else {
            alert('No se pudo añadir el producto al carrito')
        }
    }

    if (loading) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 flex justify-center items-center">
                    <div className="text-xl font-medium text-slate-500">Cargando detalles del producto...</div>
                </main>
                <Footer />
            </div>
        )
    }

    if (error !== "" || !product) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 flex flex-col justify-center items-center gap-4">
                    <div className="text-xl font-medium text-red-500">Error: {error}</div>
                    <Link to="/" className="text-primary font-bold hover:underline">Volver a inicio</Link>
                </main>
                <Footer />
            </div>
        )
    }

    let badgeElement = null
    let isButtonDisabled = false

    if (product.stock == 0) {
        badgeElement = <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md">Agotado</span>
        isButtonDisabled = true
    } else if (product.stock < 5) {
        badgeElement = <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md">Poco Stock</span>
    } else {
        badgeElement = <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md">En Stock ({product.stock})</span>
    }



    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex flex-1 flex-col px-4 md:px-10 lg:px-40 py-12">
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined mr-1 text-[20px]">arrow_back</span>
                        Volver a productos
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Galería de imágenes */}
                    <div className="flex flex-col gap-4">
                        <div className="relative aspect-square md:aspect-4/3 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                            {mainImage ? (
                                <img src={mainImage} alt={product.nombre} className="w-full h-full object-cover" />
                            ) : (
                                <ProductImage producto={product} className="w-full h-full object-cover" />
                            )}
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4">
                            {galleryImages.map((img, index) => (
                                <button 
                                    key={index}
                                    onClick={() => setMainImage(img)}
                                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                                        mainImage === img 
                                            ? 'border-primary shadow-md opacity-100' 
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <img src={img} alt={`Vista ${index + 1} de ${product.nombre}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Detalles del producto */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            {badgeElement}
                        </div>
                        
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
                            {product.nombre}
                        </h1>
                        
                        <p className="text-3xl font-bold text-primary mb-6">
                            {product.precio} €
                        </p>
                        
                        <div className="prose dark:prose-invert max-w-none mb-8">
                            <h3 className="text-lg font-bold mb-2">Descripción</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                                {product.descripcion || "Este producto es uno de los mejores accesorios disponibles en nuestra tienda. Fabricado con materiales de alta calidad, diseñado para mejorar tu productividad y destacar por su estética atractiva."}
                            </p>
                        </div>

                        <div className="mt-auto pt-8 border-t border-slate-200 dark:border-slate-800">
                            <button
                                onClick={handleAddToCart}
                                disabled={isButtonDisabled}
                                className="flex w-full md:w-auto px-10 items-center justify-center gap-2 rounded-xl h-14 bg-primary hover:bg-primary/90 text-white text-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30"
                            >
                                <span className="material-symbols-outlined">shopping_bag</span>
                                {isButtonDisabled ? 'Producto Agotado' : 'Añadir al carrito'}
                            </button>
                            {product.stock > 0 && product.stock < 5 && (
                                <p className="text-amber-500 text-sm font-medium mt-3 text-center md:text-left">
                                    ¡Date prisa! Solo quedan {product.stock} unidades.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
