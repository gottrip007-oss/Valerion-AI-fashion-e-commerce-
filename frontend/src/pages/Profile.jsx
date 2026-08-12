import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [address, setAddress] = useState(
    user?.addresses?.[0] || { line1: "", line2: "", city: "", state: "", postalCode: "", country: "India" }
  );
  const [status, setStatus] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      const res = await api.put("/users/profile", {
        name: form.name,
        phone: form.phone,
        addresses: [address],
      });
      setUser(res.data.user);
      localStorage.setItem("valerion_user", JSON.stringify(res.data.user));
      setStatus("Profile updated.");
    } catch (err) {
      setStatus(err.response?.data?.message || "Could not update profile.");
    }
  };

  return (
    <div className="container-x py-16 max-w-2xl">
      <div className="eyebrow mb-2">Account</div>
      <h1 className="font-display text-4xl mb-10">My Profile</h1>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="eyebrow block mb-2">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-stoneDark px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="eyebrow block mb-2">Email</label>
            <input value={user?.email} disabled className="w-full border border-stoneDark px-3 py-2.5 text-sm bg-stone/60 text-muted" />
          </div>
          <div>
            <label className="eyebrow block mb-2">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-stoneDark px-3 py-2.5 text-sm"
            />
          </div>
        </div>

        <div>
          <div className="eyebrow mb-3">Shipping Address</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Address Line 1"
              value={address.line1}
              onChange={(e) => setAddress({ ...address, line1: e.target.value })}
              className="w-full border border-stoneDark px-3 py-2.5 text-sm md:col-span-2"
            />
            <input
              placeholder="Address Line 2"
              value={address.line2}
              onChange={(e) => setAddress({ ...address, line2: e.target.value })}
              className="w-full border border-stoneDark px-3 py-2.5 text-sm md:col-span-2"
            />
            <input
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="w-full border border-stoneDark px-3 py-2.5 text-sm"
            />
            <input
              placeholder="State"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
              className="w-full border border-stoneDark px-3 py-2.5 text-sm"
            />
            <input
              placeholder="Postal Code"
              value={address.postalCode}
              onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
              className="w-full border border-stoneDark px-3 py-2.5 text-sm"
            />
            <input
              placeholder="Country"
              value={address.country}
              onChange={(e) => setAddress({ ...address, country: e.target.value })}
              className="w-full border border-stoneDark px-3 py-2.5 text-sm"
            />
          </div>
        </div>

        {status && <p className="text-sm text-gold">{status}</p>}
        <button type="submit" className="btn-primary">Save Changes</button>
      </form>
    </div>
  );
}
