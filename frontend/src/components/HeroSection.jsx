export default function HeroSection() {
    return (
        <section className="@container mb-12">
            <div 
                className="flex min-h-[400px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-3xl items-center justify-center p-8 relative overflow-hidden group shadow-2xl" 
                style={{ backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.2)), url("https://images.unsplash.com/photo-1593640495253-23e96b558925?w=1200&q=80")' }}
            >
                <div className="flex flex-col gap-4 text-center max-w-2xl relative z-10">
                    <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-[-0.033em]">
                        Tu Setup de Ensueño, Hecho Realidad
                    </h1>
                    <p className="text-slate-200 text-base md:text-lg font-normal">
                        Descubre nuestra selección de periféricos y componentes de alto rendimiento para llevar tu experiencia al siguiente nivel.
                    </p>
                </div>
                <button className="relative z-10 flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-12 px-6 bg-white text-primary text-base font-bold shadow-xl hover:scale-105 transition-transform">
                    <span>Ver Catálogo</span>
                </button>
            </div>
        </section>
    )
}
