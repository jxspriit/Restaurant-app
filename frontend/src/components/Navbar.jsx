import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu as MenuIcon, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? "text-copper" : "text-ink/70 hover:text-ink"}`;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-copper text-cream font-display text-lg">C</span>
          <span className="font-display text-lg font-semibold tracking-tight">Copperleaf Kitchen</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === "/"}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink/80 transition-colors hover:bg-ink/5"
            aria-label="View cart"
          >
            <ShoppingBag size={18} />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-copper px-1 text-[11px] font-semibold text-cream">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink/80 transition-colors hover:bg-ink/5"
                aria-label="Account menu"
              >
                <User size={18} />
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-card border border-ink/10 bg-white py-2 shadow-lg">
                  <p className="truncate px-4 py-1.5 text-xs text-ink/50">{user?.name}</p>
                  <Link to="/profile" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm hover:bg-ink/5">
                    Profile
                  </Link>
                  <Link to="/orders" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm hover:bg-ink/5">
                    My orders
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-ink/5">
                      <LayoutDashboard size={14} /> Admin dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-copper hover:bg-ink/5">
                    <LogOut size={14} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login" className="btn-secondary !px-4 !py-2">Log in</Link>
              <Link to="/register" className="btn-primary !px-4 !py-2">Sign up</Link>
            </div>
          )}

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-cream md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-card px-3 py-2 text-sm font-medium ${isActive ? "bg-terracotta text-ink" : "text-ink/70"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="my-2 h-px bg-ink/10" />
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)} className="rounded-card px-3 py-2 text-sm">Profile</Link>
                <Link to="/orders" onClick={() => setOpen(false)} className="rounded-card px-3 py-2 text-sm">My orders</Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setOpen(false)} className="rounded-card px-3 py-2 text-sm">Admin dashboard</Link>
                )}
                <button onClick={handleLogout} className="rounded-card px-3 py-2 text-left text-sm text-copper">Log out</button>
              </>
            ) : (
              <div className="flex gap-2 px-3 pt-2">
                <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary flex-1 !px-4 !py-2">Log in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary flex-1 !px-4 !py-2">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
