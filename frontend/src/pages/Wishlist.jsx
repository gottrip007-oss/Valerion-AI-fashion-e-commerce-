import { useCart } from "../context/CartContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { wishlist } = useCart();

  return (
    <div className="container-x py-16">
      <div className="eyebrow mb-2">Saved</div>
      <h1 className="font-display text-4xl mb-10">My Wishlist</h1>

      {wishlist?.length === 0 ? (
        <div className="text-sm text-muted">
          Nothing saved yet. <Link to="/products" className="text-gold hover:underline">Browse the collection →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {wishlist.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
