import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import { updateProfile } from "../../api/authApi.js";
import AdminLayout from "../../layouts/AdminLayout.jsx";

const AdminSettings = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await updateProfile(form);
      updateUser(data.user);
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="mt-1 text-sm text-ink/60">Manage your admin account details.</p>

      <form onSubmit={handleSubmit} className="mt-8 max-w-md space-y-4">
        <div className="card-surface space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input value={user?.email} disabled className="input-field bg-ink/5 text-ink/50" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Role</label>
            <input value={user?.role} disabled className="input-field bg-ink/5 text-ink/50 capitalize" />
          </div>
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving..." : "Save settings"}
        </button>
      </form>
    </AdminLayout>
  );
};

export default AdminSettings;
