import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface MobileNavProps {
  cartCount: number;
  userName?: string;
  onLogout: () => void;
}

export default function MobileNav({
  cartCount,
  userName,
  onLogout,
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="mobile-nav">
      <header className="mobile-nav__header">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        <Link to="/" className="mobile-nav__logo">
          RR STORE
        </Link>

        <div className="mobile-nav__actions">
          <Link to="/profile" aria-label="Profile">
            <User size={21} />
          </Link>

          <Link to="/cart" className="cart-link" aria-label="Cart">
            <ShoppingBag size={21} />
            <span className="cart-count">{cartCount}</span>
          </Link>
        </div>
      </header>

      <div className="mobile-nav__search">
        <Search size={18} />
        <input
          type="search"
          placeholder="Search products..."
          aria-label="Search products"
        />
      </div>

      {isOpen && (
        <div className="mobile-nav__overlay">
          <aside className="mobile-nav__drawer">
            <div className="mobile-nav__drawer-header">
              <span>RR STORE</span>

              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="mobile-nav__links">
              <Link to="/" onClick={closeMenu}>
                New Arrivals
              </Link>

              <Link to="/shop" onClick={closeMenu}>
                Shop
              </Link>

              <Link to="/collections" onClick={closeMenu}>
                Collections
              </Link>

              <Link to="/profile" onClick={closeMenu}>
                My Profile
              </Link>

              <Link to="/orders" onClick={closeMenu}>
                My Orders
              </Link>

              <Link to="/wishlist" onClick={closeMenu}>
                <Heart size={18} />
                Wishlist
              </Link>
            </nav>

            {userName && (
              <button
                type="button"
                className="mobile-nav__logout"
                onClick={() => {
                  closeMenu();
                  onLogout();
                }}
              >
                Logout
              </button>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}