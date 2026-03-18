# Documentación de la API

Esta API está desarrollada en Laravel y permite gestionar autenticación, productos, carrito y pedidos.

## Base URL

http://127.0.0.1:8000/api

---

## 1. Obtener productos

**Endpoint:** `GET /products`  
**Autenticación:** No requerida.

**Descripción:**  
Devuelve el listado de productos disponibles.

**Ejemplo de petición:**  
`GET http://127.0.0.1:8000/api/products`

**Respuesta esperada:**
[
  {
    "id": 1,
    "nombre": "Teclado",
    "descripcion": "Teclado mecánico",
    "precio": "49.99",
    "stock": 10,
    "imagen_url": "teclado.jpg"
  }
]

---

## 2. Redirección a login con Google

**Endpoint:** `GET /auth/google/redirect`  
**Autenticación:** No requerida.

**Descripción:**  
Redirige al usuario al flujo de autenticación de Google.

**Ejemplo de petición:**  
`GET http://127.0.0.1:8000/api/auth/google/redirect`

**Respuesta esperada:**  
Redirección a Google OAuth.

---

## 3. Ver carrito

**Endpoint:** `GET /cart`  
**Autenticación:** Sí. Requiere token JWT.

**Headers:**
Authorization: Bearer TU_TOKEN  
Accept: application/json

**Descripción:**  
Devuelve los productos del carrito del usuario autenticado.

**Ejemplo de petición:**  
`GET http://127.0.0.1:8000/api/cart`

**Respuesta esperada:**
[
  {
    "id": 1,
    "user_id": 1,
    "product_id": 2,
    "cantidad": 1,
    "product": {
      "id": 2,
      "nombre": "Ratón",
      "precio": "29.99"
    }
  }
]

---

## 4. Añadir producto al carrito

**Endpoint:** `POST /cart`  
**Autenticación:** Sí. Requiere token JWT.

**Headers:**
Authorization: Bearer TU_TOKEN  
Accept: application/json  
Content-Type: application/json

**Body:**
{
  "product_id": 1,
  "cantidad": 1
}

**Descripción:**  
Añade un producto al carrito del usuario autenticado.  
Si el producto ya existe en el carrito, se incrementa la cantidad.

**Ejemplo de petición:**  
`POST http://127.0.0.1:8000/api/cart`

**Respuesta esperada:**
{
  "id": 1,
  "user_id": 1,
  "product_id": 1,
  "cantidad": 1
}

---

## 5. Eliminar producto del carrito

**Endpoint:** `DELETE /cart/{productId}`  
**Autenticación:** Sí. Requiere token JWT.

**Headers:**
Authorization: Bearer TU_TOKEN  
Accept: application/json

**Descripción:**  
Elimina un producto concreto del carrito del usuario autenticado.

**Ejemplo de petición:**  
`DELETE http://127.0.0.1:8000/api/cart/1`

**Respuesta esperada:**
{
  "message": "Producto eliminado del carrito"
}

---

## 6. Confirmar compra

**Endpoint:** `POST /orders/confirm`  
**Autenticación:** Sí. Requiere token JWT.

**Headers:**
Authorization: Bearer TU_TOKEN  
Accept: application/json

**Descripción:**  
Confirma la compra del carrito actual del usuario autenticado.  
Este endpoint:
- crea un pedido
- crea sus líneas de pedido
- descuenta stock
- vacía el carrito

**Ejemplo de petición:**  
`POST http://127.0.0.1:8000/api/orders/confirm`

**Respuesta esperada:**
{
  "message": "Compra confirmada correctamente",
  "order": {
    "id": 1,
    "user_id": 1,
    "total": "59.98"
  }
}

---

## 7. Ver historial de compras

**Endpoint:** `GET /orders`  
**Autenticación:** Sí. Requiere token JWT.

**Headers:**
Authorization: Bearer TU_TOKEN  
Accept: application/json

**Descripción:**  
Devuelve el historial de pedidos del usuario autenticado con sus líneas de pedido.

**Ejemplo de petición:**  
`GET http://127.0.0.1:8000/api/orders`

**Respuesta esperada:**
[
  {
    "id": 1,
    "user_id": 1,
    "total": "59.98",
    "order_items": [
      {
        "id": 1,
        "product_id": 1,
        "cantidad": 2,
        "precio": "29.99"
      }
    ]
  }
]

---

## Notas

- Los endpoints de carrito y pedidos requieren autenticación mediante JWT.
- El token se obtiene tras el login con Google.
- La autenticación se envía mediante el header:

Authorization: Bearer TU_TOKEN