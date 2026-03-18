# Prueba Aicor - Full Stack

Proyecto Full Stack desarrollado con **Laravel** en el backend y **React + Vite** en el frontend.

## Descripción

La aplicación permite:

- autenticación con Google
- obtención de productos desde la API
- gestión de carrito
- confirmación de compra
- consulta de historial de pedidos

El proyecto está dividido en dos partes:

- `backend/` → API REST en Laravel
- `frontend/` → interfaz en React

---

## Tecnologías usadas

### Backend
- Laravel
- PHP
- MySQL
- Socialite
- JWT Auth

### Frontend
- React
- Vite
- React Router
- Tailwind CSS

### Testing
- PHPUnit

---

## Requisitos previos

Tener instalado:
- PHP
- COMPOSER
- NODE.JS y NPM
- MySQL
- XAMPP o entorno equivalente

## Instalación del Backend

Entrar en la carpeta Backend:
- cd backend

Instalar dependencias:
- composer install

Copiar el archivo de entorno:
- cp .env.example .env

Generar la clave de Laravel:
- php artisan key:generate

Generar la clave JWT:
- php artisan jwt:secret

Configurar en .env la conexión con la base de datos y las credenciales en Google

Migrar y poblar la base de datos:
- php artisan migrate:fresh --seed

Iniciar el servidor:
- php artisan serve

## Instalación del Front End

Entrar en la carpeta FrontEnd:
- cd frontend

Instalar dependencias:
- npm install

Ejecutar el entorno de desarrollo:
- npm run dev

## Configuración de autenticación con Google

La autenticación se realiza mediante Google OAuth en Laravel usando Socialite.

Flujo:

- El usuario pulsa en iniciar sesión con Google desde el frontend.
- El backend redirige a Google.
- Google devuelve el control al callback del backend.
- El backend genera el JWT.
- El backend redirige al frontend a /auth/callback con el token y los datos del usuario.
- El frontend guarda el token en estado global y localStorage.

## Funcionalidades principales

Productos:

- listado de productos desde la API
- visualización de nombre, precio, imagen y stock

Autenticación:

- inicio de sesión con Google
- almacenamiento del JWT en frontend
- persistencia de sesión

Carrito:

- añadir productos al carrito
- ver carrito
- eliminar productos del carrito

Pedidos:

- confirmar compra
- creación de pedido y líneas de pedido
- actualización de stock
- vaciado del carrito
- historial de compras

## Endpoints principales

Productos:

- GET /api/products

Autenticación:

- GET /api/auth/google/redirect
- GET /api/auth/google/callback

Carrito:

- GET /api/cart
- POST /api/cart
- DELETE /api/cart/{productId}

Pedidos:

- GET /api/orders
- POST /api/orders/confirm

## Tests

Los tests backend están implementados con PHPUnit.

Para ejecutar todos los tests:

- cd backend
- php artisan test

## Tests incluidos

- listado de productos
- añadir producto al carrito
- ver carrito
- eliminar producto del carrito
- confirmar compra
- ver pedidos

## Ramas usadas

El proyecto se ha trabajado siguiendo flujo con ramas y pull requests.

Ejemplos de ramas usadas:

- feature/carrito-backend
- bugfix/auth-google-redirect
- feature/carrito-frontend
- feature/tests-backend
- docs/readme

## Ejecución completa del proyecto

Backend:

- cd backend
- php artisan serve

Frontend:
- cd frontend
- npm run dev

## Estructura del proyecto

```bash
prueba_aicor/
├── backend/
└── frontend/

## Autor

- Santi :P
