import { useEffect, useState } from "react";
import api from "../../api/axios.js";

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-stoneDark p-6">
      <div className="eyebrow mb-2">{label}</div>
      <div className="font-display text-3xl">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p className="text-sm text-muted">Loading…</p>;

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        <StatCard label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`} />
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="Customers" value={stats.totalCustomers} />
        <StatCard label="Products" value={stats.totalProducts} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <div className="eyebrow mb-4">Orders by Status</div>
          <div className="space-y-2">
            {Object.entries(stats.statusBreakdown).map(([status, count]) => (
              <div key={status} className="flex justify-between text-sm border-b border-stoneDark/50 py-2">
                <span>{status}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
            {Object.keys(stats.statusBreakdown).length === 0 && (
              <p className="text-sm text-muted">No orders yet.</p>
            )}
          </div>
        </div>

        <div>
          <div className="eyebrow mb-4">Low Stock (≤ 5 units)</div>
          <div className="space-y-2">
            {stats.lowStockProducts.map((p) => (
              <div key={p._id} className="flex justify-between text-sm border-b border-stoneDark/50 py-2">
                <span>{p.name} <span className="text-muted">({p.sku})</span></span>
                <span className="font-medium text-oxblood">{p.stock} left</span>
              </div>
            ))}
            {stats.lowStockProducts.length === 0 && (
              <p className="text-sm text-muted">All products are well-stocked.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
