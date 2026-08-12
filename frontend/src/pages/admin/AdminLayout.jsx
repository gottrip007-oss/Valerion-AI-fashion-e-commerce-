import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/customers", label: "Customers" },
];

export default function AdminLayout() {
  return (
    <div className="container-x py-12">
      <div className="eyebrow mb-2">Valerion</div>
      <h1 className="font-display text-4xl mb-8">Admin Panel</h1>

      <div className="flex flex-col md:flex-row gap-10">
        <nav className="md:w-56 shrink-0">
          <ul className="flex md:flex-col gap-2 md:gap-1 flex-wrap">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 text-sm ${
                      isActive ? "bg-ink text-stone" : "hover:bg-stoneDark/40"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
