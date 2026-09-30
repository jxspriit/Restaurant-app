import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { placeOrder } from "../api/orderApi.js";

const Checkout = () => {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: user?.name || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zip: user?.address?.zip || "",
    phone: user?.phone || "",
    paymentMethod: "Cash on Delivery",
    notes: "",
  });
  const [placing, setPlacing] = useState(false);

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.street || !form.city || !form.phone) {
      toast.error("Please complete your delivery address and phone number");
      return;
    }
    setPlacing(true);
    try {
      const { data } = await placeOrder({
        items: items.map((item) => ({ foodId: item.foodId, quantity: item.quantity })),
        customerName: form.customerName,
        deliveryAddress: { street: form.street, city: form.city, state: form.state, zip: form.zip, phone: form.phone },
        paymentMethod: form.paymentMethod,
        notes: form.notes,
      });
      clearCart();
      toast.success("Order placed successfully");
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container-page py-12">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <p className="mt-1 text-sm text-ink/60">Confirm your delivery details to place the order.</p>

      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card-surface space-y-4 p-6">
            <h2 className="text-sm font-semibold text-ink/70">Contact & delivery address</h2>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Full name</label>
              <input required value={form.customerName} onChange={handleChange("customerName")} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Street address</label>
              <input required value={form.street} onChange={handleChange("street")} className="input-field" placeholder="House no., street, landmark" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">City</label>
                <input required value={form.city} onChange={handleChange("city")} className="input-field" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">State</label>
                <input value={form.state} onChange={handleChange("state")} className="input-field" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">ZIP code</label>
                <input value={form.zip} onChange={handleChange("zip")} className="input-field" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Phone number</label>
              <input required value={form.phone} onChange={handleChange("phone")} className="input-field" placeholder="For delivery coordination" />
            </div>
          </div>

          <div className="card-surface space-y-4 p-6">
            <h2 className="text-sm font-semibold text-ink/70">Payment method</h2>
            <div className="space-y-2">
              {["Cash on Delivery", "Card on Delivery", "UPI"].map((method) => (
                <label key={method} className="flex items-center gap-3 rounded-card border border-ink/10 px-4 py-3 text-sm has-[:checked]:border-copper has-[:checked]:bg-terracotta/40">
                  <input type="radio" name="paymentMethod" value={method} checked={form.paymentMethod === method} onChange={handleChange("paymentMethod")} className="accent-copper" />
                  {method}
                </label>
              ))}
            </div>
          </div>

          <div className="card-surface p-6">
            <label className="mb-1.5 block text-sm font-medium">Order notes (optional)</label>
            <textarea value={form.notes} onChange={handleChange("notes")} rows={3} className="input-field resize-none" placeholder="Delivery instructions, spice level, etc." />
          </div>
        </div>

        <div className="h-fit rounded-card border border-ink/10 bg-white p-6">
          <h2 className="font-display text-lg font-semibold">Order summary</h2>
          <div className="mt-4 max-h-52 space-y-2 overflow-y-auto text-sm">
            {items.map((item) => (
              <div key={item.foodId} className="flex justify-between text-ink/70">
                <span className="truncate pr-2">{item.quantity} × {item.name}</span>
                <span className="shrink-0">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="my-3 h-px bg-ink/10" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-ink/60"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between text-ink/60"><span>Delivery fee</span><span>₹{deliveryFee}</span></div>
            <div className="my-2 h-px bg-ink/10" />
            <div className="flex justify-between text-base font-semibold"><span>Total</span><span>₹{total}</span></div>
          </div>
          <button type="submit" disabled={placing} className="btn-primary mt-6 w-full">
            {placing ? "Placing order..." : `Place order · ₹${total}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
