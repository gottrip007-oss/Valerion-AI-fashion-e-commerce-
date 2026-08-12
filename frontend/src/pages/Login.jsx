import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-x py-24 max-w-md">
      <div className="eyebrow mb-2">Welcome Back</div>
      <h1 className="font-display text-4xl mb-10">Sign In</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
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
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="text-sm text-muted mt-6">
        New to Valerion? <Link to="/register" className="text-gold hover:underline">Create an account</Link>
      </p>
      <p className="text-xs text-muted mt-8 border-t border-stoneDark pt-4">
        Admin demo login — email: admin@valerion.com · password: Admin@12345 (after running the seed script)
      </p>
    </div>
  );
}
