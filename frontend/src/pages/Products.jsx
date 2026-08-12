import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";

const CATEGORIES = ["Dresses", "Outerwear", "Suits", "Footwear", "Bags", "Accessories", "Jewelry"];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  useEffect(() => {
    setLoading(true);
    const params = Object.fromEntries(searchParams.entries());
    api
      .get("/products", { params })
      .then((res) => setProducts(res.data.products))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="container-x py-16">
      <div className="eyebrow mb-2">Shop</div>
      <h1 className="font-display text-4xl mb-10">{category || "All Products"}</h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Filters */}
        <aside className="md:w-64 shrink-0 space-y-8">
          <div>
            <input
              type="text"
              placeholder="Search products…"
              defaultValue={search}
              onKeyDown={(e) => e.key === "Enter" && updateParam("search", e.target.value)}
              className="w-full border border-stoneDark px-3 py-2 text-sm"
            />
          </div>

          <div>
            <div className="eyebrow mb-3">Category</div>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => updateParam("category", "")}
                  className={`hover:text-gold ${!category ? "text-gold" : ""}`}
                >
                  All
                </button>
              </li>
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => updateParam("category", c)}
                    className={`hover:text-gold ${category === c ? "text-gold" : ""}`}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="eyebrow mb-3">Price (₹)</div>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                defaultValue={minPrice}
                onBlur={(e) => updateParam("minPrice", e.target.value)}
                className="w-1/2 border border-stoneDark px-2 py-1.5 text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                defaultValue={maxPrice}
                onBlur={(e) => updateParam("maxPrice", e.target.value)}
                className="w-1/2 border border-stoneDark px-2 py-1.5 text-sm"
              />
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {loading ? (
            <p className="text-sm text-muted">Loading…</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-muted">No products match those filters yet.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
