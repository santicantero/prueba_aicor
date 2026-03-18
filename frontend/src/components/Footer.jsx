export default function Footer() {
    return (
        <footer className="mt-auto px-4 md:px-10 lg:px-40 py-12 bg-slate-100 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-primary">
                        <span className="material-symbols-outlined text-2xl">computer</span>
                        <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold">AicorStore</h3>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        Equipando a los entusiastas de la tecnología con los mejores periféricos y componentes del mercado.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-8 col-span-2 md:pl-10">
                    <div className="flex flex-col gap-4">
                        <h4 className="text-slate-900 dark:text-slate-100 text-sm font-bold uppercase tracking-widest">Tienda</h4>
                        <nav className="flex flex-col gap-2">
                            <a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm" href="#">Periféricos</a>
                            <a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm" href="#">Monitores</a>
                            <a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm" href="#">Componentes</a>
                        </nav>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h4 className="text-slate-900 dark:text-slate-100 text-sm font-bold uppercase tracking-widest">Soporte</h4>
                        <nav className="flex flex-col gap-2">
                            <a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm" href="#">Envíos</a>
                            <a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm" href="#">Devoluciones</a>
                            <a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm" href="#">Contacto</a>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-slate-500 dark:text-slate-400 text-xs">© 2024 AicorStore. Todos los derechos reservados.</p>
                <div className="flex gap-6">
                    <span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer transition-colors">brand_awareness</span>
                    <span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer transition-colors">share</span>
                    <span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer transition-colors">public</span>
                </div>
            </div>
        </footer>
    )
}
