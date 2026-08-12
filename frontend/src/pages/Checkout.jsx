import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

// Loads the Razorpay Checkout script on demand (sandbox/test mode only).
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const { cart, cartTotal, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(
    user?.addresses?.[0] || { line1: "", line2: "", city: "", state: "", postalCode: "", country: "India" }
  );
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const total = cartTotal + (cartTotal > 15000 ? 0 : 250) + Math.round(cartTotal * 0.05);

  const placeOrder = async () => {
    setError("");
    if (!address.line1 || !address.city || !address.postalCode) {
      return setError("Please complete your shipping address.");
    }
    setPlacing(true);

    try {
      const orderRes = await api.post("/orders", {
        items: cart.map((c) => ({ product: c.product._id, quantity: c.quantity, size: c.size })),
        shippingAddress: address,
        paymentMethod: "razorpay",
      });
      const order = orderRes.data.order;

      const scriptLoaded = await loadRazorpayScript();
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (scriptLoaded && razorpayKey) {
        const options = {
          key: razorpayKey, // test/sandbox key only
          amount: Math.round(order.totalPrice * 100), // paise
          currency: "INR",
          name: "Valerion",
          description: `Order #${order._id.slice(-6)}`,
          handler: async (response) => {
            await api.put(`/orders/${order._id}/pay`, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            await refreshCart();
            navigate("/orders");
          },
          prefill: { name: user?.name, email: user?.email, contact: user?.phone },
          theme: { color: "#15121A" },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // No internet / no key configured — demo fallback so the flow can
        // still be reviewed end-to-end without a live Razorpay account.
        await api.put(`/orders/${order._id}/pay`, {
          razorpayOrderId: "demo_order",
          razorpayPaymentId: "demo_payment",
          razorpaySignature: "demo_signature",
        });
        await refreshCart();
        navigate("/orders");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order.");
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    return <div className="container-x py-16 text-sm text-muted">Your cart is empty.</div>;
  }

  return (
    <div className="container-x py-16 max-w-2xl">
      <div className="eyebrow mb-2">Checkout</div>
      <h1 className="font-display text-4xl mb-10">Shipping &amp; Payment</h1>

      <div className="space-y-4 mb-10">
        <div className="eyebrow mb-1">Shipping Address</div>
        <input
          placeholder="Address Line 1"
          value={address.line1}
          onChange={(e) => setAddress({ ...address, line1: e.target.value })}
          className="w-full border border-stoneDark px-3 py-2.5 text-sm"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            className="w-full border border-stoneDark px-3 py-2.5 text-sm"
          />
          <input
            placeholder="Postal Code"
            value={address.postalCode}
            onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
            className="w-full border border-stoneDark px-3 py-2.5 text-sm"
          />
        </div>
        <input
          placeholder="State"
          value={address.state}
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
          className="w-full border border-stoneDark px-3 py-2.5 text-sm"
        />
      </div>

      <div className="bg-white border border-stoneDark p-6 mb-8">
        <div className="flex justify-between font-display text-lg">
          <span>Total Due</span>
          <span>₹{total.toLocaleString("en-IN")}</span>
        </div>
        <p className="text-xs text-muted mt-2">
          Payment is processed via Razorpay's test/sandbox environment. No real charge will occur.
        </p>
      </div>

      {error && <p className="text-sm text-oxblood mb-4">{error}</p>}

      <button onClick={placeOrder} disabled={placing} className="btn-primary w-full">
        {placing ? "Processing…" : "Pay & Place Order"}
      </button>
    </div>
  );
}
