import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-ink/10 bg-charcoal text-cream/90">
      <div className="container-page grid grid-cols-1 gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-copper text-cream font-display text-lg">C</span>
            <span className="font-display text-lg font-semibold">Copperleaf Kitchen</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-cream/60">
            Wood-fired pizza, handmade pasta, and comfort classics, cooked the honest way and delivered hot.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 hover:bg-cream/10">
              <Instagram size={16} />
            </a>
            <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 hover:bg-cream/10">
              <Facebook size={16} />
            </a>
            <a href="#" aria-label="Twitter" className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 hover:bg-cream/10">
              <Twitter size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-cream">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/60">
            <li><Link to="/" className="hover:text-cream">Home</Link></li>
            <li><Link to="/menu" className="hover:text-cream">Menu</Link></li>
            <li><Link to="/about" className="hover:text-cream">About us</Link></li>
            <li><Link to="/contact" className="hover:text-cream">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-cream">Account</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/60">
            <li><Link to="/orders" className="hover:text-cream">Track an order</Link></li>
            <li><Link to="/cart" className="hover:text-cream">View cart</Link></li>
            <li><Link to="/profile" className="hover:text-cream">Your profile</Link></li>
            <li><Link to="/register" className="hover:text-cream">Create account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-cream">Visit us</h4>
          <ul className="mt-4 space-y-3 text-sm text-cream/60">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span>42 Ember Lane, Hisar, Haryana 125001</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0" />
              <span>hello@copperleaf.kitchen</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 py-5">
        <p className="container-page text-center text-xs text-cream/40">
          © {new Date().getFullYear()} Copperleaf Kitchen. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
