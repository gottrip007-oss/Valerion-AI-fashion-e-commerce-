import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-stone/95 backdrop-blur border-b border-stoneDark">
      <div className="container-x flex items-center justify-between h-20">
        <Link to="/" className="font-display text-2xl tracking-wide text-ink">
          VALERION
        </Link>

        <nav className="hidden md:flex items-center gap-8 eyebrow">
          <Link to="/products" className="hover:text-gold transition-colors">Shop</Link>
          <Link to="/products?category=Dresses" className="hover:text-gold transition-colors">Dresses</Link>
          <Link to="/products?category=Bags" className="hover:text-gold transition-colors">Bags</Link>
          <Link to="/products?category=Jewelry" className="hover:text-gold transition-colors">Jewelry</Link>
        </nav>

        <div className="flex items-center gap-5">
          <Link to="/wishlist" aria-label="Wishlist" className="text-sm hover:text-gold transition-colors">
            Wishlist
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative text-sm hover:text-gold transition-colors">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-oxblood text-stone text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setOpen((o) => !o)}
                className="text-sm hover:text-gold transition-colors"
              >
                {user.name.split(" ")[0]}
              </button>
              {open && (
                <div className="absolute right-0 mt-3 w-44 bg-white border border-stoneDark shadow-lg py-2 text-sm">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-stone" onClick={() => setOpen(false)}>Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-stone" onClick={() => setOpen(false)}>Orders</Link>
                  {user.role === "admin" && (
                    <Link to="/admin" className="block px-4 py-2 hover:bg-stone" onClick={() => setOpen(false)}>Admin Panel</Link>
                  )}
                  <button
                    onClick={() => { logout(); setOpen(false); navigate("/"); }}
                    className="block w-full text-left px-4 py-2 hover:bg-stone text-oxblood"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-outline !px-4 !py-2 text-xs">Sign In</Link>
          )}
        </div>
      </div>
    </header>
  );
}
