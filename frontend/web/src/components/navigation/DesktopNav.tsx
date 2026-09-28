import { Heart, Search, ShoppingBag, User } from "lucide-react";
import { Link } from "react-router-dom";

interface DesktopNavProps {
  cartCount: number;
  userName?: string;
  onLogout: () => void;
}

export default function DesktopNav({
  cartCount,
  userName,
  onLogout,
}: DesktopNavProps) {
  return (
    <div className="desktop-nav">
      <div className="desktop-nav__top">
        <span>Free shipping on orders over £75</span>

        <div className="desktop-nav__top-links">
          <Link to="/orders">Orders</Link>
          <Link to="/help">Help</Link>
        </div>
      </div>

      <div className="desktop-nav__main">
        <Link to="/" className="desktop-nav__logo">
          RR STORE
        </Link>

        <nav className="desktop-nav__categories">
          <Link to="/">New Arrivals</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/collections">Collections</Link>
        </nav>

        <div className="desktop-nav__search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search products..."
            aria-label="Search products"
          />
        </div>

        <div className="desktop-nav__actions">
          <button type="button" aria-label="Wishlist">
            <Heart size={21} />
          </button>

          <Link to="/profile" aria-label="Profile">
            <User size={21} />
          </Link>

          <Link to="/cart" className="cart-link" aria-label="Cart">
            <ShoppingBag size={21} />
            <span className="cart-count">{cartCount}</span>
          </Link>

          {userName && (
            <button type="button" onClick={onLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}