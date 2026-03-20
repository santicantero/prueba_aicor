import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export function CartProvider({ children }) {
    const { token } = useAuth()
    const [cartItems, setCartItems] = useState([])
    const [loadingCart, setLoadingCart] = useState(false)

    async function fetchCart() {
        if (token == null || token == "") {
            setCartItems([])
            return
        }

        setLoadingCart(true)

        try {
            const res = await fetch('http://127.0.0.1:8000/api/cart', {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })

            if (res.ok == true) {
                const data = await res.json()
                setCartItems(data)
            }
        } catch (error) {
            console.error('Error al cargar el carrito:', error)
        } finally {
            setLoadingCart(false)
        }
    }

    async function addToCart(productId, cantidad) {
        if (cantidad == null) {
            cantidad = 1
        }

        if (token == null || token == "") {
            return false
        }

        try {
            const res = await fetch('http://127.0.0.1:8000/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    product_id: productId,
                    cantidad: cantidad,
                }),
            })

            if (res.ok == true) {
                await fetchCart()
                return true
            } else {
                return false
            }
        } catch (error) {
            console.error('Error al añadir al carrito:', error)
            return false
        }
    }

    async function updateQuantity(productId, cantidad) {
        if (cantidad < 1) return false;

        if (token == null || token == "") {
            return false;
        }

        try {
            const res = await fetch(`http://127.0.0.1:8000/api/cart/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    cantidad: cantidad,
                }),
            });

            if (res.ok) {
                await fetchCart();
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error al actualizar cantidad:', error);
            return false;
        }
    }

    async function removeFromCart(productId) {
        if (token == null || token == "") {
            return false
        }

        try {
            const res = await fetch(`http://127.0.0.1:8000/api/cart/${productId}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })

            if (res.ok == true) {
                await fetchCart()
                return true
            } else {
                return false
            }
        } catch (error) {
            console.error('Error al eliminar del carrito:', error)
            return false
        }
    }

    async function confirmOrder(shippingData = {}) {
        if (token == "") {
            return false
        }

        try {
            const res = await fetch('http://127.0.0.1:8000/api/orders/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify(shippingData)
            })

            if (res.ok) {
                await fetchCart()
                return true
            }

            return false
        } catch (error) {
            console.error('Error al confirmar la compra:', error)
            return false
        }
    }

    async function validateCoupon(code) {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/coupons/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({ code })
            })
            
            const data = await res.json()
            return data
        } catch (error) {
            console.error('Error al validar cupón:', error)
            return { valid: false, message: 'Error de conexión' }
        }
    }

    useEffect(function () {
        fetchCart()
    }, [token])

    return (
        <CartContext.Provider
            value={{
                cartItems: cartItems,
                loadingCart: loadingCart,
                fetchCart: fetchCart,
                addToCart: addToCart,
                updateQuantity: updateQuantity,
                removeFromCart: removeFromCart,
                confirmOrder: confirmOrder,
                validateCoupon: validateCoupon,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}