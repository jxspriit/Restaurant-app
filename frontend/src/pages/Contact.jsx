import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import toast from "react-hot-toast";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields");
      return;
    }
    setSending(true);
    setTimeout(() => {
      toast.success("Thanks — we'll get back to you shortly");
      setForm({ name: "", email: "", message: "" });
      setSending(false);
    }, 600);
  };

  return (
    <div className="container-page py-14">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold">Get in touch</h1>
        <p className="mt-2 text-sm text-ink/60">Questions, catering requests, or feedback — we'd love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta text-copper"><MapPin size={17} /></span>
              <div><p className="text-sm font-semibold">Address</p><p className="text-sm text-ink/60">42 Ember Lane, Hisar, Haryana 125001</p></div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta text-copper"><Phone size={17} /></span>
              <div><p className="text-sm font-semibold">Phone</p><p className="text-sm text-ink/60">+91 98765 43210</p></div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta text-copper"><Mail size={17} /></span>
              <div><p className="text-sm font-semibold">Email</p><p className="text-sm text-ink/60">hello@copperleaf.kitchen</p></div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta text-copper"><Clock size={17} /></span>
              <div><p className="text-sm font-semibold">Hours</p><p className="text-sm text-ink/60">Open daily, 11:00am – 11:00pm</p></div>
            </div>
          </div>

          <div className="mt-8 aspect-[16/10] overflow-hidden rounded-card border border-ink/10 bg-terracotta">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80"
              alt="Map area near Copperleaf Kitchen"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card-surface space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Your name" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="you@example.com" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Message</label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="input-field resize-none" placeholder="How can we help?" />
          </div>
          <button type="submit" disabled={sending} className="btn-primary w-full">
            {sending ? "Sending..." : "Send message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
