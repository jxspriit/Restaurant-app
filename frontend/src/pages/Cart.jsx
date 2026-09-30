import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import EmptyState from "../components/EmptyState.jsx";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='100%25' height='100%25' fill='%23EFDCC9'/></svg>";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");

const resolveImage = (image) => {
  if (!image) return FALLBACK_IMAGE;
  return image.startsWith("http") ? image : `${API_ORIGIN}${image}`;
};

const Cart = () => {
  const { items, subtotal, deliveryFee, total, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Browse the menu to get started."
          action={<Link to="/menu" className="btn-primary">Browse the menu</Link>}
        />
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <h1 className="text-2xl font-semibold">Your cart</h1>
      <p className="mt-1 text-sm text-ink/60">{items.length} item{items.length > 1 ? "s" : ""} in your cart</p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={item.foodId} className="card-surface flex items-center gap-4 p-4">
              <img src={resolveImage(item.image)} alt={item.name} className="h-20 w-20 shrink-0 rounded-card object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border-2 ${item.isVeg ? "border-olive" : "border-copper"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${item.isVeg ? "bg-olive" : "bg-copper"}`} />
                  </span>
                  <p className="truncate font-medium">{item.name}</p>
                </div>
                <p className="mt-1 text-sm text-ink/60">₹{item.price} each</p>
              </div>

              <div className="flex items-center gap-3 rounded-card border border-ink/15 px-2 py-1.5">
                <button onClick={() => decreaseQuantity(item.foodId)} className="flex h-6 w-6 items-center justify-center text-copper"><Minus size={14} /></button>
                <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                <button onClick={() => increaseQuantity(item.foodId)} className="flex h-6 w-6 items-center justify-center text-copper"><Plus size={14} /></button>
              </div>

              <p className="w-16 shrink-0 text-right font-semibold">₹{item.price * item.quantity}</p>

              <button onClick={() => removeFromCart(item.foodId)} className="shrink-0 text-ink/30 hover:text-red-500" aria-label={`Remove ${item.name}`}>
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-card border border-ink/10 bg-white p-6">
          <h2 className="font-display text-lg font-semibold">Order summary</h2>
          <div className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between text-ink/60"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between text-ink/60"><span>Delivery fee</span><span>₹{deliveryFee}</span></div>
            <div className="my-2 h-px bg-ink/10" />
            <div className="flex justify-between text-base font-semibold"><span>Total</span><span>₹{total}</span></div>
          </div>
          <button onClick={handleCheckout} className="btn-primary mt-6 w-full">Proceed to checkout <ArrowRight size={16} /></button>
          <Link to="/menu" className="mt-3 block text-center text-sm font-medium text-copper">Add more items</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
