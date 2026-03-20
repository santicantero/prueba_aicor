import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductImage from '../components/ProductImage'

export default function AdminPage() {
    const { user, token, loading } = useAuth()
    const navigate = useNavigate()
    
    const [activeTab, setActiveTab] = useState('products')
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [customers, setCustomers] = useState([])
    const [coupons, setCoupons] = useState([])
    
    // Estados para el formulario de producto
    const [showAddProduct, setShowAddProduct] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [newProduct, setNewProduct] = useState({
        nombre: '', descripcion: '', precio: '', stock: '', imagen_url: '', categoria: 'periferico'
    })
    
    // Estados para cupones
    const [showAddCoupon, setShowAddCoupon] = useState(false)
    const [newCoupon, setNewCoupon] = useState({ code: '', discount_percentage: '' })

    useEffect(() => {
        if (!loading && (!user || !user.is_admin)) {
            navigate('/')
        }
    }, [user, loading, navigate])

    useEffect(() => {
        if (user && user.is_admin && token) {
            fetchData()
        }
    }, [user, token, activeTab])

    async function fetchData() {
        try {
            if (activeTab === 'products') {
                const res = await fetch('http://127.0.0.1:8000/api/products')
                if (res.ok) setProducts(await res.json())
            } else if (activeTab === 'orders') {
                const res = await fetch('http://127.0.0.1:8000/api/admin/orders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (res.ok) setOrders(await res.json())
            } else if (activeTab === 'customers') {
                const res = await fetch('http://127.0.0.1:8000/api/admin/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (res.ok) setCustomers(await res.json())
            } else if (activeTab === 'coupons') {
                const res = await fetch('http://127.0.0.1:8000/api/admin/coupons', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (res.ok) setCoupons(await res.json())
            }
        } catch (error) {
            console.error('Error fetching admin data:', error)
        }
    }

    async function handleEditClick(p) {
        setNewProduct({
            nombre: p.nombre,
            descripcion: p.descripcion,
            precio: p.precio,
            stock: p.stock,
            imagen_url: p.imagen_url || '',
            categoria: p.categoria || 'periferico'
        })
        setIsEditing(true)
        setEditingId(p.id)
        setShowAddProduct(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    async function handleCancel() {
        setShowAddProduct(false)
        setIsEditing(false)
        setEditingId(null)
        setNewProduct({ nombre: '', descripcion: '', precio: '', stock: '', imagen_url: '', categoria: 'periferico' })
    }

    async function handleSubmitProduct(e) {
        e.preventDefault()
        try {
            const url = isEditing 
                ? `http://127.0.0.1:8000/api/admin/products/${editingId}`
                : 'http://127.0.0.1:8000/api/admin/products'
            
            const method = isEditing ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method: method,
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(newProduct)
            })
            if (res.ok) {
                handleCancel()
                fetchData()
            } else {
                alert(`Error al ${isEditing ? 'actualizar' : 'añadir'} producto`)
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    async function handleDeleteProduct(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

        try {
            const res = await fetch(`http://127.0.0.1:8000/api/admin/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                fetchData()
            } else {
                alert('Error al eliminar producto')
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    async function handleSubmitCoupon(e) {
        e.preventDefault()
        try {
            const res = await fetch('http://127.0.0.1:8000/api/admin/coupons', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCoupon)
            })
            if (res.ok) {
                setShowAddCoupon(false)
                setNewCoupon({ code: '', discount_percentage: '' })
                fetchData()
            } else {
                const data = await res.json()
                alert(data.message || 'Error al añadir el cupón')
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    async function handleToggleCoupon(id) {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/admin/coupons/${id}/toggle`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) fetchData()
        } catch (error) {
            console.error('Error:', error)
        }
    }

    async function handleDeleteCoupon(id) {
        if (!confirm('¿Seguro que quieres borrar este cupón?')) return;
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/admin/coupons/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) fetchData()
        } catch (error) {
            console.error('Error:', error)
        }
    }

    if (loading) return <div>Cargando...</div>
    if (!user || (!user.is_admin && !loading)) {
        return <Navigate to="/" replace />
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
            <Navbar />
            
            <main className="flex-1 flex flex-col px-4 md:px-10 lg:px-20 py-8 max-w-7xl mx-auto w-full">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-extrabold flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-4xl">admin_panel_settings</span>
                        Panel de Administración
                    </h1>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 bg-white dark:bg-slate-900 rounded-t-2xl px-4 pt-4 shadow-sm">
                    <button 
                        onClick={() => setActiveTab('products')}
                        className={`px-6 py-3 font-bold border-b-2 text-lg transition-colors flex items-center gap-2 ${activeTab === 'products' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <span className="material-symbols-outlined">inventory_2</span> Productos
                    </button>
                    <button 
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-3 font-bold border-b-2 text-lg transition-colors flex items-center gap-2 ${activeTab === 'orders' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <span className="material-symbols-outlined">receipt_long</span> Pedidos
                    </button>
                    <button 
                        onClick={() => setActiveTab('customers')}
                        className={`px-6 py-3 font-bold border-b-2 text-lg transition-colors flex items-center gap-2 ${activeTab === 'customers' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <span className="material-symbols-outlined">group</span> Clientes
                    </button>
                    <button 
                        onClick={() => setActiveTab('coupons')}
                        className={`px-6 py-3 font-bold border-b-2 text-lg transition-colors flex items-center gap-2 ${activeTab === 'coupons' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <span className="material-symbols-outlined">percent</span> Cupones
                    </button>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex-1">
                    
                    {/* --- TAB PRODUCTOS --- */}
                    {activeTab === 'products' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Catálogo de Productos</h2>
                                <button 
                                    onClick={() => {
                                        if (showAddProduct) handleCancel()
                                        else setShowAddProduct(true)
                                    }}
                                    className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-primary/20 transition-all flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined">{showAddProduct ? 'close' : 'add'}</span>
                                    {showAddProduct ? 'Cancelar' : 'Añadir Producto'}
                                </button>
                            </div>

                            {showAddProduct && (
                                <form onSubmit={handleSubmitProduct} className="mb-8 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    <h3 className="text-xl font-bold mb-4">{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Nombre</label>
                                            <input required type="text" value={newProduct.nombre} onChange={e => setNewProduct({...newProduct, nombre: e.target.value})} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Categoría</label>
                                            <select value={newProduct.categoria} onChange={e => setNewProduct({...newProduct, categoria: e.target.value})} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
                                                <option value="periferico">Periférico</option>
                                                <option value="ordenador">Ordenador de Sobremesa</option>
                                                <option value="dron">Dron</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">URL de Imagen</label>
                                            <input type="text" value={newProduct.imagen_url} onChange={e => setNewProduct({...newProduct, imagen_url: e.target.value})} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" placeholder="Opcional" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Precio (€)</label>
                                            <input required type="number" step="0.01" value={newProduct.precio} onChange={e => setNewProduct({...newProduct, precio: e.target.value})} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Stock</label>
                                            <input required type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold mb-1">Descripción</label>
                                            <textarea required rows="3" value={newProduct.descripcion} onChange={e => setNewProduct({...newProduct, descripcion: e.target.value})} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"></textarea>
                                        </div>
                                    </div>
                                    <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold transition-colors">
                                        {isEditing ? 'Actualizar Producto' : 'Guardar Producto'}
                                    </button>
                                </form>
                            )}

                            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                        <tr>
                                            <th className="p-4 font-semibold uppercase text-sm">ID</th>
                                            <th className="p-4 font-semibold uppercase text-sm">Imagen</th>
                                            <th className="p-4 font-semibold uppercase text-sm">Nombre</th>
                                            <th className="p-4 font-semibold uppercase text-sm">Precio</th>
                                            <th className="p-4 font-semibold uppercase text-sm">Stock</th>
                                            <th className="p-4 font-semibold uppercase text-sm text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {products.map(p => (
                                            <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="p-4 ">{p.id}</td>
                                                <td className="p-4">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                                        <ProductImage producto={p} className="w-full h-full object-cover" />
                                                    </div>
                                                </td>
                                                <td className="p-4 font-bold">{p.nombre}</td>
                                                <td className="p-4">{p.precio} €</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-md text-sm font-bold ${p.stock > 5 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-red-100 text-red-700 dark:bg-red-900/30'}`}>
                                                        {p.stock}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => handleEditClick(p)} className="text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/30 p-2 rounded-lg transition-colors" title="Editar">
                                                            <span className="material-symbols-outlined">edit</span>
                                                        </button>
                                                        <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-2 rounded-lg transition-colors" title="Eliminar">
                                                            <span className="material-symbols-outlined">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* --- TAB PEDIDOS --- */}
                    {activeTab === 'orders' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Historial Global de Pedidos</h2>
                            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                        <tr>
                                            <th className="p-4 font-semibold uppercase text-sm">ID Pedido</th>
                                            <th className="p-4 font-semibold uppercase text-sm">Cliente</th>
                                            <th className="p-4 font-semibold uppercase text-sm">Dirección de Envío</th>
                                            <th className="p-4 font-semibold uppercase text-sm">Fecha</th>
                                            <th className="p-4 font-semibold uppercase text-sm text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {orders.map(o => (
                                            <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="p-4 font-mono font-bold">#{o.id}</td>
                                                <td className="p-4">
                                                    <div className="font-bold">{o.full_name || o.user.name}</div>
                                                    <div className="text-sm text-slate-500">{o.email || o.user.email}</div>
                                                </td>
                                                <td className="p-4 text-sm max-w-xs truncate" title={o.address}>
                                                    {o.address ? `${o.address}, ${o.zip_code}` : 'No especificada'}
                                                </td>
                                                <td className="p-4 text-sm text-slate-500">
                                                    {new Date(o.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 text-right font-bold text-primary">
                                                    {o.total} €
                                                </td>
                                            </tr>
                                        ))}
                                        {orders.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="p-8 text-center text-slate-500">No hay pedidos registrados.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* --- TAB CLIENTES --- */}
                    {activeTab === 'customers' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Gestión de Clientes</h2>
                            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                        <tr>
                                            <th className="p-4 font-semibold uppercase text-sm">ID</th>
                                            <th className="p-4 font-semibold uppercase text-sm">Nombre</th>
                                            <th className="p-4 font-semibold uppercase text-sm">Email</th>
                                            <th className="p-4 font-semibold uppercase text-sm">Reg. Desde</th>
                                            <th className="p-4 font-semibold uppercase text-sm text-right">Total Pedidos</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {customers.map(c => (
                                            <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="p-4 text-slate-500">{c.id}</td>
                                                <td className="p-4 font-bold flex items-center gap-2">
                                                    {c.is_admin ? <span className="material-symbols-outlined text-amber-500 text-[18px]" title="Administrador">stars</span> : null}
                                                    {c.name}
                                                </td>
                                                <td className="p-4">{c.email}</td>
                                                <td className="p-4 text-sm text-slate-500">{new Date(c.created_at).toLocaleDateString()}</td>
                                                <td className="p-4 text-right">
                                                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full font-bold">
                                                        {c.orders_count}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* --- TAB CUPONES --- */}
                    {activeTab === 'coupons' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Gestión de Cupones</h2>
                                <button 
                                    onClick={() => setShowAddCoupon(!showAddCoupon)}
                                    className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-primary/20 transition-all flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined">{showAddCoupon ? 'close' : 'add'}</span>
                                    {showAddCoupon ? 'Cancelar' : 'Añadir Cupón'}
                                </button>
                            </div>

                            {showAddCoupon && (
                                <form onSubmit={handleSubmitCoupon} className="mb-8 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    <h3 className="text-xl font-bold mb-4">Nuevo Cupón</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Código (Ej: VERANO20)</label>
                                            <input required type="text" value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 uppercase" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Porcentaje de Descuento (%)</label>
                                            <input required type="number" min="1" max="100" value={newCoupon.discount_percentage} onChange={e => setNewCoupon({...newCoupon, discount_percentage: e.target.value})} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                                        </div>
                                    </div>
                                    <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold transition-colors">
                                        Crear Cupón
                                    </button>
                                </form>
                            )}

                            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                        <tr>
                                            <th className="p-4 font-semibold uppercase text-sm">Código</th>
                                            <th className="p-4 font-semibold uppercase text-sm">Descuento</th>
                                            <th className="p-4 font-semibold uppercase text-sm w-32">Estado</th>
                                            <th className="p-4 font-semibold uppercase text-sm text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {coupons.map(c => (
                                            <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="p-4 font-bold font-mono text-lg text-primary">{c.code}</td>
                                                <td className="p-4 font-bold text-lg">{c.discount_percentage}%</td>
                                                <td className="p-4">
                                                    <button 
                                                        onClick={() => handleToggleCoupon(c.id)}
                                                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors border w-full text-center ${c.is_active ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200 dark:bg-emerald-900/30' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}
                                                    >
                                                        {c.is_active ? 'Activo' : 'Inactivo'}
                                                    </button>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => handleDeleteCoupon(c.id)} className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-2 rounded-lg transition-colors" title="Eliminar">
                                                            <span className="material-symbols-outlined">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {coupons.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="p-8 text-center text-slate-500">No hay cupones creados.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </main>
            
            <Footer />
        </div>
    )
}
