import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-ink text-stone mt-24">
      <div className="container-x py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="font-display text-2xl mb-3">VALERION</div>
          <p className="text-sm text-stoneDark/80 max-w-xs">
            Considered luxury ready-to-wear, styled with the help of our AI Fashion Assistant.
          </p>
        </div>
        <div>
          <div className="eyebrow text-goldLight mb-4">Shop</div>
          <ul className="space-y-2 text-sm text-stoneDark/80">
            <li><Link to="/products?category=Dresses" className="hover:text-gold">Dresses</Link></li>
            <li><Link to="/products?category=Suits" className="hover:text-gold">Suits</Link></li>
            <li><Link to="/products?category=Footwear" className="hover:text-gold">Footwear</Link></li>
            <li><Link to="/products?category=Bags" className="hover:text-gold">Bags</Link></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow text-goldLight mb-4">Client Care</div>
          <ul className="space-y-2 text-sm text-stoneDark/80">
            <li>Shipping &amp; Returns</li>
            <li>Size Guide</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div>
          <div className="eyebrow text-goldLight mb-4">The House</div>
          <ul className="space-y-2 text-sm text-stoneDark/80">
            <li>Our Story</li>
            <li>Sustainability</li>
            <li>Careers</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone/10 py-6 text-center text-xs text-stoneDark/60">
        © {new Date().getFullYear()} Valerion. Portfolio project — not a real store.
      </div>
    </footer>
  );
}
