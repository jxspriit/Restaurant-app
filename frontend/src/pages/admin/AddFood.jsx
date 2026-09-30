import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImagePlus } from "lucide-react";
import toast from "react-hot-toast";
import { createFood, updateFood, getFoodById } from "../../api/foodApi.js";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import LoadingSkeleton from "../../components/LoadingSkeleton.jsx";

const categories = ["Pizza", "Burgers", "Pasta", "Indian", "Chinese", "Desserts", "Drinks"];
const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "Pizza",
  isVeg: true,
  isAvailable: true,
  isFeatured: false,
  isPopular: false,
};

const AddFood = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const { data } = await getFoodById(id);
        const f = data.food;
        setForm({
          name: f.name,
          description: f.description,
          price: f.price,
          category: f.category,
          isVeg: f.isVeg,
          isAvailable: f.isAvailable,
          isFeatured: f.isFeatured,
          isPopular: f.isPopular,
        });
        if (f.image) setPreview(f.image.startsWith("http") ? f.image : `${API_ORIGIN}${f.image}`);
      } catch {
        toast.error("Could not load food item");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price) {
      toast.error("Please fill in name, description and price");
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (imageFile) formData.append("image", imageFile);

      if (isEdit) {
        await updateFood(id, formData);
        toast.success("Food item updated");
      } else {
        await createFood(formData);
        toast.success("Food item added");
      }
      navigate("/admin/foods");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save food item");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSkeleton type="spinner" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold">{isEdit ? "Edit food item" : "Add a new food item"}</h1>
      <p className="mt-1 text-sm text-ink/60">{isEdit ? "Update details for this menu item." : "Fill in the details to add it to your menu."}</p>

      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card-surface space-y-4 p-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Food name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Margherita Pizza" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Description</label>
              <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" placeholder="Describe the dish..." />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Price (₹)</label>
                <input required type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="card-surface space-y-4 p-6">
            <h2 className="text-sm font-semibold text-ink/70">Options</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { key: "isVeg", label: "Vegetarian" },
                { key: "isAvailable", label: "Available for order" },
                { key: "isFeatured", label: "Featured dish" },
                { key: "isPopular", label: "Mark as popular" },
              ].map((opt) => (
                <label key={opt.key} className="flex items-center gap-2.5 rounded-card border border-ink/10 px-4 py-3 text-sm">
                  <input type="checkbox" checked={form[opt.key]} onChange={(e) => setForm({ ...form, [opt.key]: e.target.checked })} className="accent-copper" />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-surface p-6">
            <h2 className="text-sm font-semibold text-ink/70">Food image</h2>
            <label className="mt-3 flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-card border border-dashed border-ink/20 bg-terracotta/30 text-ink/50 hover:bg-terracotta/50">
              {preview ? (
                <img src={preview} alt="Preview" className="h-full w-full rounded-card object-cover" />
              ) : (
                <>
                  <ImagePlus size={28} />
                  <span className="text-xs">Click to upload</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? "Saving..." : isEdit ? "Save changes" : "Add to menu"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AddFood;
