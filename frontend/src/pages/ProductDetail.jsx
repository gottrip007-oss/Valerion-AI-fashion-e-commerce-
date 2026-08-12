import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data.product));
  }, [id]);

  if (!product) return <div className="container-x py-16 text-sm text-muted">Loading…</div>;

  const isSaved = wishlist?.some((p) => p._id === product._id);

  const handleAddToCart = async () => {
    if (!user) return setStatus("Please sign in to add items to your cart.");
    if (product.sizes?.length && !size) return setStatus("Please select a size.");
    await addToCart(product._id, qty, size);
    setStatus("Added to cart.");
  };

  return (
    <div className="container-x py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
        <div className="aspect-[3/4] bg-stoneDark/40 overflow-hidden">
          <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div>
          <div className="eyebrow mb-2">{product.category}</div>
          <h1 className="font-display text-4xl mb-3">{product.name}</h1>
          <div className="text-xl mb-6">
            ₹{product.price.toLocaleString("en-IN")}
            {product.compareAtPrice && (
              <span className="ml-3 text-muted line-through text-base">
                ₹{product.compareAtPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <p className="text-sm text-ink/80 leading-relaxed mb-8">{product.description}</p>

          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <div className="eyebrow mb-2">Size</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`border px-3 py-1.5 text-sm ${
                      size === s ? "border-ink bg-ink text-stone" : "border-stoneDark hover:border-ink"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <div className="eyebrow mb-2">Quantity</div>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              className="w-20 border border-stoneDark px-3 py-2 text-sm"
            />
          </div>

          <div className="flex gap-3">
            <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-primary disabled:opacity-40">
              {product.stock === 0 ? "Sold Out" : "Add to Cart"}
            </button>
            {user && (
              <button
                onClick={() => toggleWishlist(product._id)}
                className="btn-outline"
              >
                {isSaved ? "♥ Saved" : "♡ Save"}
              </button>
            )}
          </div>
          {status && <p className="text-sm text-oxblood mt-3">{status}</p>}

          <div className="mt-10 pt-8 border-t border-stoneDark text-sm text-muted space-y-1">
            <div>Material: {product.material}</div>
            <div>SKU: {product.sku}</div>
            {product.occasion?.length > 0 && <div>Occasion: {product.occasion.join(", ")}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
