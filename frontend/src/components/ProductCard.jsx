import { useState } from 'react';
import { Link } from 'react-router-dom';
import FastCheckoutModal from './FastCheckoutModal';
import ProductImage from './ProductImage';

export default function ProductCard({ producto, onAddToCart }) {
    const [isFastCheckoutOpen, setIsFastCheckoutOpen] = useState(false);

    let badgeElement = <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-wider text-primary shadow-md">Destacado</span>
    let stockCircleClass = "size-2 rounded-full bg-emerald-500"
    let stockText = "En Stock (" + producto.stock + ")"
    let isButtonDisabled = false

    if (producto.stock == 0) {
        badgeElement = <span className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md">Agotado</span>
        stockCircleClass = "size-2 rounded-full bg-red-500"
        stockText = "Agotado"
        isButtonDisabled = true
    } else if (producto.stock < 5) {
        badgeElement = <span className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md">Poco Stock</span>
    }

    return (
        <div className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-800">
            <Link to={`/product/${producto.id}`} className="relative aspect-4/5 overflow-hidden block">
                <ProductImage 
                    producto={producto} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                {badgeElement}
            </Link>
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <Link to={`/product/${producto.id}`} className="hover:text-primary transition-colors">
                        <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight pr-2">{producto.nombre}</h3>
                    </Link>
                    <div className="flex flex-col items-end gap-1">
                        <p className="text-primary font-bold whitespace-nowrap">{producto.precio} €</p>
                        <button 
                            hidden={isButtonDisabled}
                            onClick={() => setIsFastCheckoutOpen(true)}
                            className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold text-amber-500 hover:text-white border border-amber-500 hover:bg-amber-500 rounded px-1.5 py-0.5 transition-all shadow-sm shadow-amber-500/10"
                            title="Compra Rápida Sin Registro"
                        >
                            <span className="material-symbols-outlined text-[14px]">bolt</span>
                            Rápida
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 mb-6">
                    <span className={stockCircleClass}></span>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wide">
                        {stockText}
                    </p>
                </div>
                <button
                    onClick={function () { onAddToCart(producto.id) }}
                    disabled={isButtonDisabled}
                    className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl h-11 bg-primary/10 hover:bg-primary text-primary hover:text-white text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                    Añadir al carrito
                </button>
            </div>
            
            {isFastCheckoutOpen && (
                <FastCheckoutModal
                    producto={producto}
                    onClose={() => setIsFastCheckoutOpen(false)}
                />
            )}
        </div>
    )
}
