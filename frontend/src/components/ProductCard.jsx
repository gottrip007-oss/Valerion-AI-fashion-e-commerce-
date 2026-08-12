import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ product }) {
  const { wishlist, toggleWishlist } = useCart();
  const isSaved = wishlist?.some((p) => p._id === product._id);

  return (
    <div className="group">
      <div className="relative overflow-hidden bg-stoneDark/40 aspect-[3/4]">
        <Link to={`/products/${product._id}`}>
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <button
          onClick={() => toggleWishlist(product._id)}
          aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors ${
            isSaved ? "bg-oxblood text-stone" : "bg-white/90 text-ink hover:bg-ink hover:text-stone"
          }`}
        >
          {isSaved ? "♥" : "♡"}
        </button>
        {product.stock === 0 && (
          <span className="absolute bottom-3 left-3 bg-ink text-stone text-[10px] uppercase tracking-eyebrow px-2 py-1">
            Sold Out
          </span>
        )}
      </div>
      <Link to={`/products/${product._id}`} className="block mt-3">
        <div className="eyebrow mb-1">{product.category}</div>
        <div className="font-display text-lg leading-snug">{product.name}</div>
        <div className="mt-1 text-sm">
          ₹{product.price.toLocaleString("en-IN")}
          {product.compareAtPrice && (
            <span className="ml-2 text-muted line-through">
              ₹{product.compareAtPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
