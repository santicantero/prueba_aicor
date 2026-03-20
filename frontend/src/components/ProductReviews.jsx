import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProductReviews({ productId }) {
    const { user, token } = useAuth();
    
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [eligibility, setEligibility] = useState({ eligible: false, has_bought: false, has_reviewed: false });
    
    // UI State
    const [loading, setLoading] = useState(true);
    const [filterRating, setFilterRating] = useState(0); // 0 means all
    const [sortMode, setSortMode] = useState('recent'); // future-proofing for more sort options
    
    // Form State
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const fetchReviews = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/products/${productId}/reviews`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data.reviews);
                setAverageRating(data.average_rating);
                setTotalReviews(data.total_reviews);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    const checkEligibility = async () => {
        if (!token) return;
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/products/${productId}/can-review`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setEligibility(data);
            }
        } catch (error) {
            console.error("Error checking eligibility:", error);
        }
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchReviews(), checkEligibility()]).finally(() => setLoading(false));
    }, [productId, token]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError("");

        try {
            const res = await fetch(`http://127.0.0.1:8000/api/products/${productId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rating: newRating, comment: newComment })
            });

            const data = await res.json();

            if (res.ok) {
                setNewComment("");
                setNewRating(5);
                setEligibility(prev => ({ ...prev, eligible: false, has_reviewed: true }));
                fetchReviews(); // Reload list
            } else {
                setSubmitError(data.message || "Error al enviar la reseña");
            }
        } catch (error) {
            console.error(error);
            setSubmitError("Error de conexión");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredReviews = reviews.filter(r => filterRating === 0 || r.rating === filterRating);
    
    // Sort logic (mostly handled by backend 'latest' but just in case we add more options)
    const sortedReviews = [...filteredReviews].sort((a, b) => {
        if (sortMode === 'recent') {
            return new Date(b.created_at) - new Date(a.created_at);
        }
        return 0;
    });

    // Helper function to render stars
    const renderStars = (rating) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`material-symbols-outlined text-lg ${i < rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} style={{ fontVariationSettings: i < rating ? "'FILL' 1" : "'FILL' 0" }}>
                star
            </span>
        ));
    };

    if (loading) return <div className="py-8 text-center text-slate-500">Cargando valoraciones...</div>;

    return (
        <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl text-amber-500">hotel_class</span>
                Valoraciones de clientes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Review Stats */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 text-center">
                    <div className="text-6xl font-black text-slate-900 dark:text-white mb-2">{averageRating}<span className="text-2xl text-slate-400 font-bold">/5</span></div>
                    <div className="flex gap-1 mb-3">
                        {renderStars(Math.round(averageRating))}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Basado en {totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'}</p>
                </div>

                {/* Filters */}
                <div className="md:col-span-2 flex flex-col justify-center">
                    <h3 className="font-bold text-lg mb-4">Filtrar opiniones</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <button 
                            onClick={() => setFilterRating(0)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterRating === 0 ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'}`}
                        >
                            Todas
                        </button>
                        {[5, 4, 3, 2, 1].map(star => (
                            <button 
                                key={star}
                                onClick={() => setFilterRating(star)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1 ${filterRating === star ? 'bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-900/30' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'}`}
                            >
                                {star} <span className="material-symbols-outlined text-[16px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-500">Ordenar por:</span>
                        <select 
                            value={sortMode} 
                            onChange={(e) => setSortMode(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:border-primary"
                        >
                            <option value="recent">Más recientes</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* List of Reviews */}
            <div className="space-y-6 mb-12">
                {sortedReviews.length === 0 ? (
                    <div className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-3xl text-center border font-medium border-slate-200 dark:border-slate-700 text-slate-500">
                        {filterRating === 0 ? 'Aún no hay valoraciones para este producto. Sé el primero en dejar la tuya.' : `No hay valoraciones de ${filterRating} estrellas.`}
                    </div>
                ) : (
                    sortedReviews.map(review => (
                        <div key={review.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                                        {review.user?.name ? review.user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white leading-tight">{review.user?.name || 'Usuario Anónimo'}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{new Date(review.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="flex gap-0.5">
                                    {renderStars(review.rating)}
                                </div>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                {review.comment}
                            </p>
                            
                            {review.admin_response && (
                                <div className="mt-4 bg-slate-50 dark:bg-slate-800 p-4 border-l-4 border-primary rounded-r-xl">
                                    <p className="font-bold text-primary flex items-center gap-2 mb-1 text-sm">
                                        <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                                        Respuesta de AicorStore
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {review.admin_response}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Submit Review Form */}
            {user && (
                <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-6 md:p-8 rounded-3xl">
                    <h3 className="text-2xl font-bold mb-2">Deja tu opinión</h3>
                    
                    {eligibility.eligible ? (
                        <form onSubmit={handleSubmitReview} className="mt-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tu valoración</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button 
                                            key={star}
                                            type="button"
                                            onClick={() => setNewRating(star)}
                                            className="text-3xl transition-transform hover:scale-110 active:scale-95"
                                        >
                                            <span className={`material-symbols-outlined text-[32px] ${star <= newRating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} style={{ fontVariationSettings: star <= newRating ? "'FILL' 1" : "'FILL' 0" }}>
                                                star
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tu comentario</label>
                                <textarea 
                                    required
                                    rows="4"
                                    value={newComment}
                                    onChange={e => setNewComment(e.target.value)}
                                    placeholder="¿Qué te ha parecido el producto? ¿Lo recomendarías?"
                                    className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-primary dark:focus:border-primary rounded-xl px-4 py-3 outline-none transition-colors resize-none"
                                />
                            </div>

                            {submitError && <p className="text-red-500 font-medium text-sm">{submitError}</p>}

                            <button 
                                type="submit"
                                disabled={isSubmitting || !newComment.trim()}
                                className="self-end px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:shadow-none"
                            >
                                {isSubmitting ? 'Enviando...' : 'Enviar reseña'}
                            </button>
                        </form>
                    ) : (
                        <div className="mt-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-900/50 flex items-start gap-4">
                            <span className="material-symbols-outlined text-amber-500 text-3xl shrink-0">info</span>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white mb-1">
                                    {eligibility.has_reviewed ? 'Ya has valorado este producto' : 'Debes comprar este producto para poder valorarlo'}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {eligibility.has_reviewed 
                                        ? 'Gracias por compartir tu opinión con la comunidad de AicorStore. Tu reseña ayuda a otros usuarios a tomar mejores decisiones.' 
                                        : 'Solo los clientes que hayan completado un pedido con este artículo pueden dejar una opinión verificada.'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
