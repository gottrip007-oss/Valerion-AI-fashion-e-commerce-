import { useEffect, useState } from "react";
import api from "../../api/axios.js";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    api.get("/users").then((res) => setCustomers(res.data.users));
  }, []);

  return (
    <div className="overflow-x-auto">
      <div className="eyebrow mb-6">Customers</div>
      <table className="w-full text-sm border border-stoneDark">
        <thead>
          <tr className="bg-stoneDark/30 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Joined</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c._id} className="border-t border-stoneDark/50">
              <td className="p-3">{c.name}</td>
              <td className="p-3">{c.email}</td>
              <td className="p-3">{c.phone || "—"}</td>
              <td className="p-3">{new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
            </tr>
          ))}
          {customers.length === 0 && (
            <tr><td colSpan={4} className="p-4 text-center text-muted">No customers yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
