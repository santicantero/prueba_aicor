import './App.css'
import { Routes, Route } from 'react-router-dom'
import ProductsPage from './pages/ProductsPage'
import AuthCallback from './components/AuthCallback'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProductsPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/orders" element={<OrdersPage />} />
    </Routes>
  )
}

export default App