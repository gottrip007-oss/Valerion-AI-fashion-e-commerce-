import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const STATUS_COLORS = {
  Pending: "text-muted",
  Confirmed: "text-gold",
  Shipped: "text-gold",
  Delivered: "text-green-700",
  Cancelled: "text-oxblood",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my").then((res) => setOrders(res.data.orders)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-x py-16">
      <div className="eyebrow mb-2">Account</div>
      <h1 className="font-display text-4xl mb-10">My Orders</h1>

      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : orders.length === 0 ? (
        <div className="text-sm text-muted">
          No orders yet. <Link to="/products" className="text-gold hover:underline">Start shopping →</Link>
        </div>
      ) : (
        <div className="divide-y divide-stoneDark border-t border-b border-stoneDark">
          {orders.map((o) => (
            <div key={o._id} className="py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="font-display text-lg">Order #{o._id.slice(-6).toUpperCase()}</div>
                <div className="text-xs text-muted mt-1">
                  Placed {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  {" · "}{o.items.length} item{o.items.length > 1 ? "s" : ""}
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className={`text-sm font-medium ${STATUS_COLORS[o.status] || ""}`}>{o.status}</div>
                <div className="text-sm">₹{o.totalPrice.toLocaleString("en-IN")}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
