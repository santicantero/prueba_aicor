import './App.css'
import { useState } from 'react'
import { useEffect } from 'react'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    setError("")

    async function loadProducts() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/products")
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
        } else {
          setError("Error HTTP: " + res.status)
        }
      } catch (err) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  return (
    <>
      <div>
        <h1>Productos</h1>
        {loading && <h2>Cargando</h2>}
        {error && <h2>{error}</h2>}
        {!loading && !error &&
          <ul>
            {products.map(p => (<li key={p.id}>{p.nombre}, {p.precio + " €"}, {p.stock}</li>))}
          </ul>}
      </div>
    </>
  )
}

export default App
