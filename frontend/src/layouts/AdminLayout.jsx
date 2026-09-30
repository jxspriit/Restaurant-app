import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  PlusCircle,
  ClipboardList,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/foods", label: "Manage Foods", icon: UtensilsCrossed },
  { to: "/admin/foods/new", label: "Add Food", icon: PlusCircle },
  { to: "/admin/orders", label: "Manage Orders", icon: ClipboardList },
  { to: "/admin/users", label: "Manage Users", icon: Users },
  { to: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-cream md:flex-row">
      <aside className="shrink-0 border-b border-ink/10 bg-white md:w-64 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between p-5 md:block">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">Admin panel</p>
            <p className="mt-0.5 truncate text-sm font-semibold">{user?.name}</p>
          </div>
          <Link to="/" className="flex items-center gap-1.5 text-xs font-medium text-copper md:mt-3">
            <ArrowLeft size={13} /> Back to site
          </Link>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:px-3">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-card px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-terracotta text-copper-dark" : "text-ink/65 hover:bg-ink/5"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
          <button onClick={logout} className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-card px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 md:mt-4">
            <LogOut size={16} /> Logout
          </button>
        </nav>
      </aside>

      <main className="min-w-0 flex-1 p-5 sm:p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
