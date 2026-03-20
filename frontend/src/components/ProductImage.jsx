import { useState } from 'react';

export default function ProductImage({ producto, className = "" }) {
    const defaultImages = {
        "Teclado": "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80",
        "Ratón": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
        "Alfombrilla grande": "https://images.unsplash.com/photo-1616428315106-904359e9bf9b?w=800&q=80",
        "Cascos Gaming": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        "Monitor 27 pulgadas": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
        "Ordenador de Sobremesa": "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&q=80",
        "Lampara de lava": "https://images.unsplash.com/photo-1571167530330-9e635cbc1dca?w=800&q=80",
        "Regleta": "https://images.unsplash.com/photo-1629739683359-99436fc9fca6?w=800&q=80",
        "Hub usb C": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
        "Dron": "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&q=80"
    };

    const techFallback = "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80";

    const getInitialUrl = () => {
        if (producto.imagen_url && producto.imagen_url.trim() !== "" && producto.imagen_url.startsWith('http')) {
            return producto.imagen_url;
        }
        
        // Fuzzy match for default images
        const name = producto.nombre || "";
        for (const [key, url] of Object.entries(defaultImages)) {
            if (name.toLowerCase().includes(key.toLowerCase())) {
                return url;
            }
        }
        
        return techFallback;
    };

    const [imgSrc, setImgSrc] = useState(getInitialUrl());
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(techFallback);
        }
    };

    return (
        <img 
            src={imgSrc} 
            alt={producto.nombre} 
            className={className} 
            onError={handleError}
            loading="lazy"
        />
    );
}
