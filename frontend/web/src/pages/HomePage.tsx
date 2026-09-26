import { useDispatch } from 'react-redux'

import { addItem } from '../features/cart/cartSlice'

export function HomePage() {
  const dispatch = useDispatch()

  const handleAddToCart = () => {
    dispatch(
      addItem({
        id: '1',
        name: 'Test Product',
        quantity: 1,
      }),
    )
  }

  return (
    <main>
      <h1>Welcome to RR Store</h1>

      <button onClick={handleAddToCart}>
        Add Test Product
      </button>
    </main>
  )
}