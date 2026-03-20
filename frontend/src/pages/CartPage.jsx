import { useCart } from '../context/CartContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ProductImage from '../components/ProductImage'

export default function CartPage() {
    const { cartItems, loadingCart, removeFromCart, updateQuantity, validateCoupon } = useCart()
    const navigate = useNavigate()
    
    // Estados para cupones
    const [couponCode, setCouponCode] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState(null)
    const [couponError, setCouponError] = useState('')
    const [isValidating, setIsValidating] = useState(false)

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

    async function handleDecrease(productId, currentCantidad) {
        if (currentCantidad > 1) {
            await updateQuantity(productId, currentCantidad - 1)
        } else {
            handleRemove(productId)
        }
    }

    async function handleIncrease(productId, currentCantidad) {
        await updateQuantity(productId, currentCantidad + 1)
    }

    function handleCheckout() {
        navigate('/checkout', { 
            state: { appliedCoupon: appliedCoupon } 
        })
    }

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return
        
        setIsValidating(true)
        setCouponError('')
        
        const result = await validateCoupon(couponCode)
        
        if (result.valid) {
            setAppliedCoupon(result)
            setCouponError('')
        } else {
            setAppliedCoupon(null)
            setCouponError(result.message || 'Cupón no válido')
        }
        setIsValidating(false)
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

    let checkoutButtonDisabled = false
    if (cartItems.length == 0) {
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
                            return (
                                <div key={item.id} className="flex p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 gap-4 items-center transition-all hover:shadow-md">
                                    <div className="w-24 h-24 rounded-xl relative overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                                        <ProductImage producto={item.product} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold">{item.product.nombre}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-2">{item.product.precio} €</p>
                                        
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                                                <button 
                                                    onClick={() => handleDecrease(item.product_id, item.cantidad)}
                                                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">remove</span>
                                                </button>
                                                <span className="w-8 text-center font-bold text-sm">{item.cantidad}</span>
                                                <button 
                                                    onClick={() => handleIncrease(item.product_id, item.cantidad)}
                                                    disabled={item.cantidad >= item.product.stock}
                                                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-slate-500"
                                                    title={item.cantidad >= item.product.stock ? "No hay más stock disponible" : ""}
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">add</span>
                                                </button>
                                            </div>
                                        </div>
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

                            {appliedCoupon && (
                                <div className="flex justify-between mb-4 text-emerald-600 dark:text-emerald-400 font-medium">
                                    <span>Descuento ({appliedCoupon.discount_percentage}%)</span>
                                    <span>- {(total * (appliedCoupon.discount_percentage / 100)).toFixed(2)} €</span>
                                </div>
                            )}

                            <div className="h-px bg-slate-200 dark:bg-slate-800 my-4"></div>
                            
                            <div className="flex justify-between mb-6 text-lg font-bold">
                                <span>Total</span>
                                <div className="text-right">
                                    {appliedCoupon ? (
                                        <>
                                            <span className="block text-sm text-slate-400 line-through font-normal">{total.toFixed(2)} €</span>
                                            <span className="text-primary text-xl">{(total - (total * (appliedCoupon.discount_percentage / 100))).toFixed(2)} €</span>
                                        </>
                                    ) : (
                                        <span className="text-primary text-xl">{total.toFixed(2)} €</span>
                                    )}
                                </div>
                            </div>

                            {/* Coupon Input */}
                            <div className="mb-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Cupón de descuento</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        disabled={!!appliedCoupon || isValidating}
                                        className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-primary uppercase text-sm font-bold"
                                        placeholder="CÓDIGO"
                                    />
                                    {!appliedCoupon ? (
                                        <button 
                                            onClick={handleApplyCoupon}
                                            disabled={isValidating || !couponCode}
                                            className="px-3 py-2 bg-slate-800 dark:bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors text-sm disabled:opacity-50"
                                        >
                                            {isValidating ? '...' : 'Aplicar'}
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => {setAppliedCoupon(null); setCouponCode('')}}
                                            className="px-3 py-2 bg-red-100 text-red-600 font-bold rounded-lg hover:bg-red-200 transition-colors text-sm"
                                        >
                                            Quitar
                                        </button>
                                    )}
                                </div>
                                {couponError && <p className="text-red-500 text-[10px] mt-1 font-medium">{couponError}</p>}
                                {appliedCoupon && <p className="text-emerald-500 text-[10px] mt-1 font-medium">¡Cupón {appliedCoupon.code} aplicado!</p>}
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={checkoutButtonDisabled}
                                className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex justify-center items-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                <span className="material-symbols-outlined">credit_card</span>
                                Proceder al pago
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}