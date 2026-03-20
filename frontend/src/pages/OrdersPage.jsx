import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import InvoiceModal from '../components/InvoiceModal'
import ProductImage from '../components/ProductImage'

export default function OrdersPage() {
    const { token } = useAuth()

    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [selectedOrder, setSelectedOrder] = useState(null)



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
                                    <div className="flex gap-4 items-center w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-none border-slate-200 dark:border-slate-700">
                                        <div className="text-left md:text-right mr-4">
                                            <p className="text-xs text-slate-500 mb-1 uppercase font-bold tracking-widest">Total del Pedido</p>
                                            <p className="font-black text-primary text-xl">{parseFloat(order.total).toFixed(2)} €</p>
                                        </div>
                                        <button 
                                            onClick={() => setSelectedOrder(order)}
                                            className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                                            Ver Factura
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 focus-within:ring mt-2">
                                    <ul className="flex flex-col gap-6">
                                        {order.order_items.map(function (item) {
                                            const nombre = item.product ? item.product.nombre : 'Producto desconocido'

                                            return (
                                                <li key={item.id} className="flex gap-4 items-center">
                                                    <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative flex-shrink-0 shadow-sm">
                                                        <ProductImage producto={item.product || { nombre: 'Desconocido' }} className="w-full h-full object-cover" />
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
            <InvoiceModal 
                isOpen={!!selectedOrder} 
                onClose={() => setSelectedOrder(null)} 
                order={selectedOrder} 
            />
        </div>
    )
}