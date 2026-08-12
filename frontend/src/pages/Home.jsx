import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";

const COLLECTIONS = [
  { name: "Evening", category: "Dresses", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800" },
  { name: "Tailoring", category: "Suits", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800" },
  { name: "Accessories", category: "Bags", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800" },
];

const TESTIMONIALS = [
  { quote: "The AI assistant found the exact black dress I had in my head — down to the neckline.", name: "R. Mehta" },
  { quote: "Ordered a wedding-guest look end to end in one chat. Faster than scrolling for an hour.", name: "A. Kapoor" },
  { quote: "Tailoring is genuinely couture-adjacent. The camel coat is in permanent rotation.", name: "S. Rao" },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get("/products/featured").then((res) => setFeatured(res.data.products));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-ink text-stone overflow-hidden">
        <div className="container-x py-28 md:py-40 relative z-10">
          <div className="eyebrow text-goldLight mb-6">Valerion — Ready-to-Wear</div>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.05] max-w-3xl">
            Dressed by intuition.
            <br />
            <span className="italic">Styled by intelligence.</span>
          </h1>
          <div className="gold-rule my-8" />
          <p className="max-w-md text-stoneDark/90 mb-10">
            Describe the moment — a room, a mood, a color — and our AI Fashion Assistant
            will style the pieces to match, pulled from a considered collection.
          </p>
          <div className="flex gap-4">
            <Link to="/products" className="btn-primary bg-gold text-ink hover:bg-goldLight">
              Shop the Collection
            </Link>
            <Link to="/products?occasion=Formal Evening" className="btn-outline !border-stone !text-stone hover:!bg-stone hover:!text-ink">
              Evening Edit
            </Link>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container-x py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="eyebrow mb-2">Curated</div>
            <h2 className="font-display text-3xl md:text-4xl">Featured Pieces</h2>
          </div>
          <Link to="/products" className="text-sm uppercase tracking-wide hover:text-gold transition-colors hidden md:block">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {featured.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="bg-white py-24">
        <div className="container-x">
          <div className="eyebrow mb-2">Shop By</div>
          <h2 className="font-display text-3xl md:text-4xl mb-10">Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLLECTIONS.map((c) => (
              <Link
                to={`/products?category=${encodeURIComponent(c.category)}`}
                key={c.name}
                className="group relative h-96 overflow-hidden block"
              >
                <img
                  src={c.img}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-stone font-display text-2xl">{c.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-x py-24">
        <div className="eyebrow mb-2 text-center">Client Notes</div>
        <h2 className="font-display text-3xl md:text-4xl text-center mb-14">What They're Wearing It To</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="text-center">
              <p className="font-display italic text-xl leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
              <div className="eyebrow">{t.name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
