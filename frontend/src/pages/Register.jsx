import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-x py-24 max-w-md">
      <div className="eyebrow mb-2">Join Valerion</div>
      <h1 className="font-display text-4xl mb-10">Create Account</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="eyebrow block mb-2">Full Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-stoneDark px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="eyebrow block mb-2">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-stoneDark px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="eyebrow block mb-2">Phone (optional)</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-stoneDark px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="eyebrow block mb-2">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-stoneDark px-3 py-2.5 text-sm"
          />
        </div>
        {error && <p className="text-sm text-oxblood">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="text-sm text-muted mt-6">
        Already have an account? <Link to="/login" className="text-gold hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
