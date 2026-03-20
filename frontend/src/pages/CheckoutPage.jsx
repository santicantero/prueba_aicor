import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function CheckoutPage() {
    const { cartItems, confirmOrder, validateCoupon } = useCart()
    const navigate = useNavigate()
    const location = useLocation()
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [couponCode, setCouponCode] = useState(location.state?.appliedCoupon?.code || '')
    const [appliedCoupon, setAppliedCoupon] = useState(location.state?.appliedCoupon || null)
    const [couponError, setCouponError] = useState('')
    const [isValidating, setIsValidating] = useState(false)
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        zipCode: ''
    })

    // Redirigir si el carrito está vacío (y no estamos procesando la compra)
    useEffect(() => {
        if (cartItems.length === 0 && !isSubmitting) {
            navigate('/cart', { replace: true })
        }
    }, [cartItems, navigate, isSubmitting])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        setIsSubmitting(true)
        
        // Enviamos los datos junto con el código del cupón si existe
        const ok = await confirmOrder({
            ...formData,
            coupon_code: appliedCoupon ? appliedCoupon.code : null
        })
        
        if (ok) {
            navigate('/orders')
        } else {
            alert('Error al procesar el pedido. Por favor inténtalo de nuevo.')
            setIsSubmitting(false)
        }
    }

    // Calcular total usando la misma lógica que en el carrito
    let total = 0
    for (let i = 0; i < cartItems.length; i++) {
        let item = cartItems[i]
        total += (item.product.precio * item.cantidad)
    }

    if (cartItems.length === 0) {
        return null // Evitar pre-render mientras redirige
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex flex-1 flex-col px-4 md:px-10 lg:px-40 py-12">
                <div className="mb-8">
                    <Link to="/cart" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined mr-1 text-[20px]">arrow_back</span>
                        Volver al carrito
                    </Link>
                </div>

                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8">Checkout y Envío</h1>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Formulario */}
                    <div className="flex-1 w-full bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <h2 className="text-2xl font-bold mb-6">Datos de envío</h2>
                        
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="fullName" className="text-sm font-bold text-slate-700 dark:text-slate-300">Nombre completo</label>
                                <input 
                                    type="text" 
                                    id="fullName"
                                    name="fullName"
                                    required
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-primary dark:focus:border-primary rounded-xl px-4 py-3 outline-none transition-colors"
                                    placeholder="Ej: Laura García López"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="email" className="text-sm font-bold text-slate-700 dark:text-slate-300">Correo electrónico</label>
                                    <input 
                                        type="email" 
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-primary dark:focus:border-primary rounded-xl px-4 py-3 outline-none transition-colors"
                                        placeholder="ejemplo@correo.com"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="phone" className="text-sm font-bold text-slate-700 dark:text-slate-300">Teléfono</label>
                                    <input 
                                        type="tel" 
                                        id="phone"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-primary dark:focus:border-primary rounded-xl px-4 py-3 outline-none transition-colors"
                                        placeholder="+34 600 000 000"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="address" className="text-sm font-bold text-slate-700 dark:text-slate-300">Dirección de entrega</label>
                                <input 
                                    type="text" 
                                    id="address"
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-primary dark:focus:border-primary rounded-xl px-4 py-3 outline-none transition-colors"
                                    placeholder="Calle, número, piso, puerta..."
                                />
                            </div>

                            <div className="flex flex-col gap-2 md:w-1/2">
                                <label htmlFor="zipCode" className="text-sm font-bold text-slate-700 dark:text-slate-300">Código Postal</label>
                                <input 
                                    type="text" 
                                    id="zipCode"
                                    name="zipCode"
                                    required
                                    value={formData.zipCode}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-primary dark:focus:border-primary rounded-xl px-4 py-3 outline-none transition-colors"
                                    placeholder="28001"
                                />
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">sell</span>
                                    ¿Tienes un cupón?
                                </h3>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        disabled={!!appliedCoupon || isValidating}
                                        className="flex-1 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-primary uppercase text-sm font-bold"
                                        placeholder="CÓDIGO"
                                    />
                                    {!appliedCoupon ? (
                                        <button 
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            disabled={isValidating || !couponCode}
                                            className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                                        >
                                            {isValidating ? '...' : 'Aplicar'}
                                        </button>
                                    ) : (
                                        <button 
                                            type="button"
                                            onClick={() => {setAppliedCoupon(null); setCouponCode('')}}
                                            className="px-4 py-2 bg-red-100 text-red-600 font-bold rounded-xl hover:bg-red-200 transition-colors"
                                        >
                                            Quitar
                                        </button>
                                    )}
                                </div>
                                {couponError && <p className="text-red-500 text-xs mt-2 font-medium">{couponError}</p>}
                                {appliedCoupon && <p className="text-emerald-500 text-xs mt-2 font-medium">¡Cupón {appliedCoupon.code} aplicado! ({appliedCoupon.discount_percentage}% dto.)</p>}
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-primary text-white text-lg font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex justify-center items-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
                                >
                                    <span className="material-symbols-outlined">local_shipping</span>
                                    {isSubmitting ? 'Procesando...' : 'Comprar y Enviar'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Resumen lateral */}
                    <div className="w-full lg:w-[380px]">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 sticky top-24">
                            <h3 className="text-xl font-bold mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">Resumen de Compra</h3>
                            
                            <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center py-2 text-sm">
                                        <div className="flex gap-2 items-center flex-1 pr-4">
                                            <span className="font-bold text-primary">{item.cantidad}x</span>
                                            <span className="truncate text-slate-700 dark:text-slate-300">{item.product.nombre}</span>
                                        </div>
                                        <span className="font-bold whitespace-nowrap">{(item.product.precio * item.cantidad).toFixed(2)} €</span>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px bg-slate-200 dark:bg-slate-800 my-4"></div>
                            
                            <div className="flex justify-between mb-4 text-slate-600 dark:text-slate-400">
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
                            
                            <div className="flex justify-between text-xl font-bold">
                                <span>Total Final</span>
                                <div className="text-right">
                                    {appliedCoupon ? (
                                        <>
                                            <span className="block text-sm text-slate-400 line-through font-normal">{total.toFixed(2)} €</span>
                                            <span className="text-primary">{(total - (total * (appliedCoupon.discount_percentage / 100))).toFixed(2)} €</span>
                                        </>
                                    ) : (
                                        <span className="text-primary">{total.toFixed(2)} €</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
