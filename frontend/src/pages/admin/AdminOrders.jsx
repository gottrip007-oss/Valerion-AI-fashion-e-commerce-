import { useEffect, useState } from "react";
import api from "../../api/axios.js";

const STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const loadOrders = () => {
    api.get("/orders").then((res) => setOrders(res.data.orders));
  };

  useEffect(() => { loadOrders(); }, []);

  const handleStatusChange = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    loadOrders();
  };

  return (
    <div className="overflow-x-auto">
      <div className="eyebrow mb-6">All Orders</div>
      <table className="w-full text-sm border border-stoneDark">
        <thead>
          <tr className="bg-stoneDark/30 text-left">
            <th className="p-3">Order</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Items</th>
            <th className="p-3">Total</th>
            <th className="p-3">Paid</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} className="border-t border-stoneDark/50">
              <td className="p-3">#{o._id.slice(-6).toUpperCase()}</td>
              <td className="p-3">{o.user?.name}<div className="text-xs text-muted">{o.user?.email}</div></td>
              <td className="p-3">{o.items.length}</td>
              <td className="p-3">₹{o.totalPrice.toLocaleString("en-IN")}</td>
              <td className="p-3">{o.isPaid ? "Yes" : "No"}</td>
              <td className="p-3">
                <select
                  value={o.status}
                  onChange={(e) => handleStatusChange(o._id, e.target.value)}
                  className="border border-stoneDark px-2 py-1 text-xs"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr><td colSpan={6} className="p-4 text-center text-muted">No orders yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
