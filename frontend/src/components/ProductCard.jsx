export default function ProductCard({ producto, onAddToCart }) {
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

    let imageUrl = "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80"
    if (producto.imagen_url != null && producto.imagen_url != "") {
        imageUrl = producto.imagen_url
    } else if (defaultImages[producto.nombre] != null) {
        imageUrl = defaultImages[producto.nombre]
    }

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
            <div className="relative aspect-[4/5] overflow-hidden">
                <div
                    className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url("${imageUrl}")` }}
                ></div>
                {badgeElement}
            </div>
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight">{producto.nombre}</h3>
                    <p className="text-primary font-bold">{producto.precio} €</p>
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
        </div>
    )
}
