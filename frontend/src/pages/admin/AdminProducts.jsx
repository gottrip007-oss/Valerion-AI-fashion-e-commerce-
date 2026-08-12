import { useEffect, useState } from "react";
import api from "../../api/axios.js";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  compareAtPrice: "",
  category: "Dresses",
  occasion: "",
  color: "",
  sizes: "",
  material: "",
  images: "",
  stock: "",
  sku: "",
  tags: "",
  featured: false,
};

const CATEGORIES = ["Dresses", "Outerwear", "Suits", "Footwear", "Bags", "Accessories", "Jewelry"];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const loadProducts = () => {
    api.get("/products", { params: { limit: 100 } }).then((res) => setProducts(res.data.products));
  };

  useEffect(() => { loadProducts(); }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      compareAtPrice: p.compareAtPrice || "",
      category: p.category,
      occasion: (p.occasion || []).join(", "),
      color: (p.color || []).join(", "),
      sizes: (p.sizes || []).join(", "),
      material: p.material || "",
      images: (p.images || []).join(", "),
      stock: p.stock,
      sku: p.sku,
      tags: (p.tags || []).join(", "),
      featured: p.featured,
    });
    setEditingId(p._id);
    setShowForm(true);
  };

  const toArray = (str) => str.split(",").map((s) => s.trim()).filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      stock: Number(form.stock),
      occasion: toArray(form.occasion),
      color: toArray(form.color),
      sizes: toArray(form.sizes),
      images: toArray(form.images),
      tags: toArray(form.tags),
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      setShowForm(false);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save product.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="eyebrow">Inventory</div>
        <button onClick={openCreate} className="btn-primary !px-4 !py-2 text-xs">+ Add Product</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-stoneDark p-6 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-stoneDark px-3 py-2 text-sm" />
            <input placeholder="SKU" required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="border border-stoneDark px-3 py-2 text-sm" />
            <input type="number" placeholder="Price (₹)" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border border-stoneDark px-3 py-2 text-sm" />
            <input type="number" placeholder="Compare-at Price (optional)" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} className="border border-stoneDark px-3 py-2 text-sm" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border border-stoneDark px-3 py-2 text-sm">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="number" placeholder="Stock" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border border-stoneDark px-3 py-2 text-sm" />
            <input placeholder="Material" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className="border border-stoneDark px-3 py-2 text-sm md:col-span-2" />
            <input placeholder="Occasion (comma-separated)" value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })} className="border border-stoneDark px-3 py-2 text-sm" />
            <input placeholder="Color (comma-separated)" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="border border-stoneDark px-3 py-2 text-sm" />
            <input placeholder="Sizes (comma-separated)" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className="border border-stoneDark px-3 py-2 text-sm" />
            <input placeholder="Tags (comma-separated, feeds AI assistant)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="border border-stoneDark px-3 py-2 text-sm" />
            <input placeholder="Image URL(s), comma-separated" required value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className="border border-stoneDark px-3 py-2 text-sm md:col-span-2" />
          </div>
          <textarea placeholder="Description" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-stoneDark px-3 py-2 text-sm" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Featured on homepage
          </label>
          {error && <p className="text-sm text-oxblood">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" className="btn-primary !px-5 !py-2 text-xs">{editingId ? "Save Changes" : "Create Product"}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline !px-5 !py-2 text-xs">Cancel</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-stoneDark">
          <thead>
            <tr className="bg-stoneDark/30 text-left">
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Featured</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t border-stoneDark/50">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">₹{p.price.toLocaleString("en-IN")}</td>
                <td className={`p-3 ${p.stock <= 5 ? "text-oxblood" : ""}`}>{p.stock}</td>
                <td className="p-3">{p.featured ? "Yes" : "—"}</td>
                <td className="p-3 text-right space-x-3">
                  <button onClick={() => openEdit(p)} className="text-gold hover:underline">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="text-oxblood hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
