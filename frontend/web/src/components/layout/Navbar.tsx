import keycloak from '../../features/auth/keycloak'
import { useCurrentUser } from '../../features/auth/hooks/useCurrentUser'
import { Link } from 'react-router-dom'

import { useSelector } from 'react-redux'
import type { RootState } from '../../app/store'


export function Navbar() {
  const cartItems = useSelector(
    (state: RootState) => state.cart.items,
  )
  const {
    data: user,
    isLoading,
  } = useCurrentUser()

  const handleLogout = () => {
    keycloak.logout({
      redirectUri: window.location.origin,
    })
  }

  return (
    <nav>
      <div>
        <strong>RR Store</strong>
      </div>
      <span>Cart: {cartItems.length}</span>
      <Link to="/">Home</Link> ||||
      <Link to="/profile">Profile</Link>

      <div>
        {isLoading ? (
          <span>Loading...</span>
        ) : (
          <>
            <span>
              {user?.first_name} {user?.last_name}
            </span>

            <button onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}