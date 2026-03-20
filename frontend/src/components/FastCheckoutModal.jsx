import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductImage from './ProductImage';

export default function FastCheckoutModal({ producto, onClose }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { validateCoupon } = useCart();
    const [cantidad, setCantidad] = useState(1);
    const [loading, setLoading] = useState(false);
    
    // Estados para cupones
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [isValidating, setIsValidating] = useState(false);

    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        zipCode: ''
    });

    // Update form if user logs in/out while modal is open (rare but good practice)
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: prev.fullName || user.name,
                email: prev.email || user.email
            }));
        }
    }, [user]);

    const handleIncrease = () => {
        if (cantidad < producto.stock) {
            setCantidad(c => c + 1);
        }
    };

    const handleDecrease = () => {
        if (cantidad > 1) {
            setCantidad(c => c - 1);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        
        setIsValidating(true);
        setCouponError('');
        
        const result = await validateCoupon(couponCode);
        
        if (result.valid) {
            setAppliedCoupon(result);
            setCouponError('');
        } else {
            setAppliedCoupon(null);
            setCouponError(result.message || 'Cupón no válido');
        }
        setIsValidating(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch('http://127.0.0.1:8000/api/orders/fast', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    product_id: producto.id,
                    cantidad: cantidad,
                    coupon_code: appliedCoupon ? appliedCoupon.code : null,
                    ...formData
                })
            });

            if (res.ok) {
                alert('¡Compra rápida completada con éxito!');
                onClose();
            } else {
                const data = await res.json();
                alert(data.message || 'Error al procesar la compra rápida.');
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión.');
        } finally {
            setLoading(false);
        }
    };

    const total = (producto.precio * cantidad).toFixed(2);

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-200">
                {/* Lateral Izquierdo: Producto */}
                <div className="w-full md:w-2/5 bg-slate-50 dark:bg-slate-800 p-8 flex flex-col relative">
                    <button 
                        onClick={onClose} 
                        className="md:hidden absolute top-4 right-4 text-slate-400 hover:text-slate-900 bg-white p-2 rounded-full shadow-sm"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-500">bolt</span>
                        Compra Rápida
                    </h2>
                    
                    <div className="aspect-square rounded-2xl overflow-hidden mb-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <ProductImage producto={producto} className="w-full h-full object-cover" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                        {producto.nombre}
                    </h3>
                    <p className="text-primary font-bold text-2xl mb-6">{producto.precio} €</p>
                    
                    <div className="mt-auto">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider block mb-2">Unidades</label>
                        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700 w-fit">
                            <button 
                                type="button"
                                onClick={handleDecrease}
                                disabled={cantidad <= 1}
                                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30"
                            >
                                <span className="material-symbols-outlined">remove</span>
                            </button>
                            <span className="w-8 text-center font-bold text-lg">{cantidad}</span>
                            <button 
                                type="button"
                                onClick={handleIncrease}
                                disabled={cantidad >= producto.stock}
                                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-primary transition-colors disabled:opacity-30"
                            >
                                <span className="material-symbols-outlined">add</span>
                            </button>
                        </div>
                        {cantidad >= producto.stock && (
                            <p className="text-xs text-amber-500 font-medium mt-2">Stock máximo alcanzado</p>
                        )}
                    </div>
                </div>

                {/* Lateral Derecho: Formulario */}
                <div className="w-full md:w-3/5 p-8 relative flex flex-col overflow-y-auto">
                    <button 
                        onClick={onClose} 
                        className="hidden md:flex absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-3xl">close</span>
                    </button>
                    
                    <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100">Tus Datos de Envío</h3>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">Nombre Completo</label>
                                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-slate-900 dark:text-white" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">Correo Electrónico</label>
                                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-slate-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">Teléfono</label>
                                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-slate-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">Código Postal</label>
                                <input required type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-slate-900 dark:text-white" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">Dirección Completa</label>
                                <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-slate-900 dark:text-white" />
                                </div>
                        </div>

                        {/* Coupon Section */}
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">sell</span>
                                ¿Tienes un cupón?
                            </h4>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    disabled={!!appliedCoupon || isValidating}
                                    className="flex-1 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-primary uppercase text-xs font-bold transition-all"
                                    placeholder="CÓDIGO"
                                />
                                {!appliedCoupon ? (
                                    <button 
                                        type="button"
                                        onClick={handleApplyCoupon}
                                        disabled={isValidating || !couponCode}
                                        className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 text-sm"
                                    >
                                        {isValidating ? '...' : 'Aplicar'}
                                    </button>
                                ) : (
                                    <button 
                                        type="button"
                                        onClick={() => {setAppliedCoupon(null); setCouponCode('')}}
                                        className="px-4 py-2 bg-red-100 text-red-600 font-bold rounded-xl hover:bg-red-200 transition-colors text-sm"
                                    >
                                        Quitar
                                    </button>
                                )}
                            </div>
                            {couponError && <p className="text-red-500 text-[10px] mt-1 font-medium">{couponError}</p>}
                            {appliedCoupon && <p className="text-emerald-500 text-[10px] mt-1 font-medium">¡Cupón {appliedCoupon.code} aplicado! ({appliedCoupon.discount_percentage}% dto.)</p>}
                        </div>

                        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="mb-4">
                                {appliedCoupon && (
                                    <div className="flex justify-between items-center text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">
                                        <span>Descuento ({appliedCoupon.discount_percentage}%)</span>
                                        <span>- {(parseFloat(total) * (appliedCoupon.discount_percentage / 100)).toFixed(2)} €</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 font-bold">Total a pagar</span>
                                    <div className="text-right">
                                        {appliedCoupon ? (
                                            <>
                                                <span className="block text-xs text-slate-400 line-through font-normal">{total} €</span>
                                                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                                    {(parseFloat(total) - (parseFloat(total) * (appliedCoupon.discount_percentage / 100))).toFixed(2)} €
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{total} €</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-primary dark:hover:bg-primary hover:text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-slate-900/10 dark:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? 'Procesando...' : (
                                    <>
                                        <span className="material-symbols-outlined">credit_card</span>
                                        Comprar Ahora
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
