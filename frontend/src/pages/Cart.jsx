import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { cart, updateCartItem, removeCartItem, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container-x py-16">
      <div className="eyebrow mb-2">Bag</div>
      <h1 className="font-display text-4xl mb-10">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-sm text-muted">
          Your cart is empty. <Link to="/products" className="text-gold hover:underline">Continue shopping →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
          <div className="lg:col-span-2 divide-y divide-stoneDark">
            {cart.map((item) => (
              <div key={item._id} className="flex gap-5 py-6">
                <img
                  src={item.product?.images?.[0]}
                  alt={item.product?.name}
                  className="w-24 h-32 object-cover bg-stoneDark/40"
                />
                <div className="flex-1">
                  <Link to={`/products/${item.product?._id}`} className="font-display text-lg hover:text-gold">
                    {item.product?.name}
                  </Link>
                  {item.size && <div className="text-sm text-muted mt-1">Size: {item.size}</div>}
                  <div className="text-sm mt-1">₹{item.product?.price?.toLocaleString("en-IN")}</div>

                  <div className="flex items-center gap-4 mt-3">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateCartItem(item._id, Math.max(1, Number(e.target.value)))}
                      className="w-16 border border-stoneDark px-2 py-1 text-sm"
                    />
                    <button
                      onClick={() => removeCartItem(item._id)}
                      className="text-xs uppercase tracking-wide text-oxblood hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-sm font-medium">
                  ₹{(item.product?.price * item.quantity).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-stoneDark p-8 h-fit">
            <div className="eyebrow mb-4">Order Summary</div>
            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm mb-2 text-muted">
              <span>Shipping</span>
              <span>{cartTotal > 15000 ? "Free" : "₹250"}</span>
            </div>
            <div className="flex justify-between text-sm mb-6 text-muted">
              <span>Estimated Tax</span>
              <span>₹{Math.round(cartTotal * 0.05).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between font-display text-lg border-t border-stoneDark pt-4 mb-6">
              <span>Total</span>
              <span>
                ₹
                {(
                  cartTotal +
                  (cartTotal > 15000 ? 0 : 250) +
                  Math.round(cartTotal * 0.05)
                ).toLocaleString("en-IN")}
              </span>
            </div>
            <button onClick={() => navigate("/checkout")} className="btn-primary w-full">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
