import { useCart } from '../context/CartContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function CartPage() {
    const { cartItems, loadingCart, removeFromCart, confirmOrder } = useCart()
    const navigate = useNavigate()
    const [isCheckingOut, setIsCheckingOut] = useState(false)

    const defaultImages = {
        "Teclado": "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80",
        "Ratón": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
        "Alfombrilla grande": "https://images.unsplash.com/photo-1616428315106-904359e9bf9b?w=800&q=80",
        "Cascos Gaming": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        "Monitor 27 pulgadas": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
        "Ordenador de Sobremesa": "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&q=80",
        "Lampara de lava": "https://images.unsplash.com/photo-1571167530330-9e635cbc1dca?w=800&q=80",
        "Regleta": "https://images.unsplash.com/photo-1629739683359-99436fc9fca6?w=800&q=80",
        "Hub usb C": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80"
    };

    let total = 0
    for (let i = 0; i < cartItems.length; i++) {
        let item = cartItems[i]
        total = total + (item.product.precio * item.cantidad)
    }

    async function handleRemove(productId) {
        const ok = await removeFromCart(productId)

        if (ok == false) {
            alert('No se pudo eliminar el producto del carrito')
        }
    }

    async function handleCheckout() {
        setIsCheckingOut(true)
        const ok = await confirmOrder()

        if (ok == true) {
            navigate('/orders')
        } else {
            alert('Error al confirmar el pedido. Por favor inténtalo de nuevo.')
            setIsCheckingOut(false)
        }
    }

    if (loadingCart == true) {
        return (
            <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen flex flex-col">
                <Navbar />
                <main className="flex flex-1 flex-col px-4 md:px-10 lg:px-40 py-8">
                    <h1 className="text-3xl font-extrabold mb-8">Mi Carrito</h1>
                    <div className="flex justify-center items-center py-20 text-xl font-medium text-slate-500">
                        Cargando carrito...
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (cartItems.length == 0) {
        return (
            <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen flex flex-col">
                <Navbar />
                <main className="flex flex-1 flex-col px-4 md:px-10 lg:px-40 py-8">
                    <h1 className="text-3xl font-extrabold mb-8">Mi Carrito</h1>
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">shopping_cart</span>
                        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Tu carrito está vacío</h2>
                        <p className="text-slate-500 text-center mb-6">Parece que aún no has añadido nada a tu carrito.</p>
                        <Link to="/" className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                            Explorar productos
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    let checkoutButtonText = 'Proceder al pago'
    if (isCheckingOut == true) {
        checkoutButtonText = 'Procesando pago...'
    }

    let checkoutButtonDisabled = false
    if (isCheckingOut == true || cartItems.length == 0) {
        checkoutButtonDisabled = true
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen flex flex-col">
            <Navbar />
            <main className="flex flex-1 flex-col px-4 md:px-10 lg:px-40 py-8">
                <h1 className="text-3xl font-extrabold mb-8">Mi Carrito</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 flex flex-col gap-4">
                        {cartItems.map(function (item) {
                            let imageUrl = "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80"

                            if (item.product.imagen_url != null && item.product.imagen_url != "") {
                                imageUrl = item.product.imagen_url
                            } else {
                                const n = item.product.nombre.toLowerCase();
                                if (n.includes("teclado")) {
                                    imageUrl = "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80";
                                } else if (n.includes("ratón")) {
                                    imageUrl = "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80";
                                } else if (n.includes("alfombrilla")) {
                                    imageUrl = "https://images.unsplash.com/photo-1629429464245-4874997f1e73?w=800&q=80";
                                } else if (n.includes("cascos") || n.includes("auriculares")) {
                                    imageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";
                                } else if (n.includes("monitor")) {
                                    imageUrl = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80";
                                } else if (n.includes("ordenador") || n.includes("sobremesa")) {
                                    imageUrl = "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&q=80";
                                } else if (n.includes("lampara") || n.includes("lámpara")) {
                                    imageUrl = "https://images.unsplash.com/photo-1542332606-b3d2703867cd?w=800&q=80";
                                } else if (n.includes("regleta")) {
                                    imageUrl = "https://images.unsplash.com/photo-1585351149313-be5939fc9b2c?w=800&q=80";
                                } else if (n.includes("hub") || n.includes("usb")) {
                                    imageUrl = "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80";
                                }
                            }

                            return (
                                <div key={item.id} className="flex p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 gap-4 items-center transition-all hover:shadow-md">
                                    <div className="w-24 h-24 rounded-xl relative overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">
                                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${imageUrl}")` }}></div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold">{item.product.nombre}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{item.product.precio} € x {item.cantidad}</p>
                                    </div>
                                    <div className="text-right flex flex-col items-end justify-between h-full">
                                        <p className="font-bold text-lg text-primary">{(item.product.precio * item.cantidad).toFixed(2)} €</p>
                                        <button
                                            onClick={function () { handleRemove(item.product_id) }}
                                            className="mt-auto text-sm text-red-500 hover:text-red-700 font-medium flex items-center justify-end gap-1 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="w-full lg:w-[350px]">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 sticky top-24">
                            <h3 className="text-xl font-bold mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">Resumen</h3>

                            <div className="flex justify-between mb-4 text-slate-600 dark:text-slate-400 mt-4">
                                <span>Subtotal</span>
                                <span>{total.toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between mb-4 text-slate-600 dark:text-slate-400">
                                <span>Envío estimado</span>
                                <span className="text-emerald-500 font-medium">Gratis</span>
                            </div>
                            <div className="h-px bg-slate-200 dark:bg-slate-800 my-4"></div>
                            <div className="flex justify-between mb-6 text-lg font-bold">
                                <span>Total</span>
                                <span className="text-primary text-xl">{total.toFixed(2)} €</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={checkoutButtonDisabled}
                                className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex justify-center items-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                <span className="material-symbols-outlined">credit_card</span>
                                {checkoutButtonText}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}