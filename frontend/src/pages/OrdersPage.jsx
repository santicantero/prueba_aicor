import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

export default function OrdersPage() {
    const { token } = useAuth()

    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")



    useEffect(function () {
        async function loadOrders() {
            if (token == "") {
                setOrders([])
                setLoading(false)
                return
            }

            try {
                const res = await fetch('http://127.0.0.1:8000/api/orders', {
                    headers: {
                        Accept: 'application/json',
                        Authorization: 'Bearer ' + token,
                    },
                })

                if (res.ok == true) {
                    const data = await res.json()
                    setOrders(data)
                } else {
                    setError('Error al cargar los pedidos')
                }
            } catch (error) {
                setError('Error de conexión')
            } finally {
                setLoading(false)
            }
        }

        loadOrders()
    }, [token])

    if (loading == true) {
        return (
            <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen flex flex-col">
                <Navbar />
                <main className="flex flex-1 flex-col px-4 md:px-10 lg:px-40 py-8">
                    <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
                        <span className="material-symbols-outlined text-4xl text-primary">local_shipping</span>
                        Mis Compras
                    </h1>
                    <div className="flex justify-center items-center py-20 text-xl font-medium text-slate-500">
                        Cargando pedidos...
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (error != "") {
        return (
            <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen flex flex-col">
                <Navbar />
                <main className="flex flex-1 flex-col px-4 md:px-10 lg:px-40 py-8">
                    <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
                        <span className="material-symbols-outlined text-4xl text-primary">local_shipping</span>
                        Mis Compras
                    </h1>
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <span className="material-symbols-outlined text-6xl text-red-400 mb-4">error</span>
                        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Ha ocurrido un problema</h2>
                        <p className="text-slate-500 text-center">{error}</p>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (orders.length == 0) {
        return (
            <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen flex flex-col">
                <Navbar />
                <main className="flex flex-1 flex-col px-4 md:px-10 lg:px-40 py-8">
                    <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
                        <span className="material-symbols-outlined text-4xl text-primary">local_shipping</span>
                        Mis Compras
                    </h1>
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">inventory_2</span>
                        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No tienes compras todavía</h2>
                        <p className="text-slate-500 text-center mb-6">Cuando finalices un pedido exitosamente, aparecerá aquí.</p>
                        <Link to="/" className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                            Ir a la tienda
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen flex flex-col">
            <Navbar />

            <main className="flex flex-1 flex-col px-4 md:px-10 lg:px-40 py-8">
                <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-primary">local_shipping</span>
                    Mis Compras
                </h1>

                <div className="flex flex-col gap-8">
                    {orders.map(function (order) {
                        return (
                            <div key={order.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="bg-slate-50 dark:bg-slate-800/40 p-5 px-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1 uppercase font-bold tracking-widest">Número de Pedido</p>
                                            <p className="font-bold text-lg">#{order.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1 uppercase font-bold tracking-widest">Estado</p>
                                            <p className="font-semibold text-emerald-600 dark:text-emerald-400">Completado</p>
                                        </div>
                                    </div>
                                    <div className="text-left md:text-right w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-none border-slate-200 dark:border-slate-700">
                                        <p className="text-xs text-slate-500 mb-1 uppercase font-bold tracking-widest">Total del Pedido</p>
                                        <p className="font-black text-primary text-xl">{parseFloat(order.total).toFixed(2)} €</p>
                                    </div>
                                </div>

                                <div className="p-6 focus-within:ring mt-2">
                                    <ul className="flex flex-col gap-6">
                                        {order.order_items.map(function (item) {
                                            let nombre = 'Producto desconocido'
                                            let imagen_url = "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80"

                                            if (item.product != null) {
                                                nombre = item.product.nombre
                                                if (item.product.imagen_url != null && item.product.imagen_url != "") {
                                                    imagen_url = item.product.imagen_url
                                                } else {
                                                    const n = item.product.nombre.toLowerCase();
                                                    if (n.includes("teclado")) {
                                                        imagen_url = "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80";
                                                    } else if (n.includes("ratón")) {
                                                        imagen_url = "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80";
                                                    } else if (n.includes("alfombrilla")) {
                                                        imagen_url = "https://images.unsplash.com/photo-1629429464245-4874997f1e73?w=800&q=80";
                                                    } else if (n.includes("cascos") || n.includes("auriculares")) {
                                                        imagen_url = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";
                                                    } else if (n.includes("monitor")) {
                                                        imagen_url = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80";
                                                    } else if (n.includes("ordenador") || n.includes("sobremesa")) {
                                                        imagen_url = "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&q=80";
                                                    } else if (n.includes("lampara") || n.includes("lámpara")) {
                                                        imagen_url = "https://images.unsplash.com/photo-1542332606-b3d2703867cd?w=800&q=80";
                                                    } else if (n.includes("regleta")) {
                                                        imagen_url = "https://images.unsplash.com/photo-1585351149313-be5939fc9b2c?w=800&q=80";
                                                    } else if (n.includes("hub") || n.includes("usb")) {
                                                        imagen_url = "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80";
                                                    }
                                                }
                                            }

                                            return (
                                                <li key={item.id} className="flex gap-4 items-center">
                                                    <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative flex-shrink-0 shadow-sm">
                                                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${imagen_url}")` }}></div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <Link to="/" className="font-bold text-slate-900 dark:text-slate-100 hover:text-primary transition-colors text-lg">
                                                            {nombre}
                                                        </Link>
                                                        <div className="flex gap-4 mt-1">
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">Cantidad: {item.cantidad}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-slate-700 dark:text-slate-300 text-lg">{parseFloat(item.precio).toFixed(2)} €</p>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </main>

            <Footer />
        </div>
    )
}