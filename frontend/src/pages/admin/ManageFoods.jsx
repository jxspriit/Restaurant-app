import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import toast from "react-hot-toast";
import { getFoods, deleteFood } from "../../api/foodApi.js";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import LoadingSkeleton from "../../components/LoadingSkeleton.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import EmptyState from "../../components/EmptyState.jsx";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");
const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100%25' height='100%25' fill='%23EFDCC9'/></svg>";

const resolveImage = (image) => {
  if (!image) return FALLBACK_IMAGE;
  return image.startsWith("http") ? image : `${API_ORIGIN}${image}`;
};

const ManageFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getFoods(search ? { search } : {});
      setFoods(data.foods);
    } catch {
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(load, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = async () => {
    try {
      await deleteFood(deleteTarget._id);
      toast.success("Food item deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete item");
      setDeleteTarget(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Manage foods</h1>
          <p className="mt-1 text-sm text-ink/60">{foods.length} items on your menu</p>
        </div>
        <Link to="/admin/foods/new" className="btn-primary"><Plus size={16} /> Add food</Link>
      </div>

      <div className="relative mt-6 max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search foods..." className="input-field !pl-10" />
      </div>

      <div className="mt-6">
        {loading ? (
          <LoadingSkeleton type="spinner" />
        ) : foods.length === 0 ? (
          <EmptyState title="No food items found" description="Add your first dish to get started." />
        ) : (
          <div className="overflow-x-auto rounded-card border border-ink/10 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left text-xs font-semibold uppercase tracking-wide text-ink/40">
                  <th className="p-4">Item</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {foods.map((food) => (
                  <tr key={food._id} className="border-b border-ink/5 last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={resolveImage(food.image)} alt={food.name} className="h-10 w-10 rounded-card object-cover" />
                        <div>
                          <p className="font-medium">{food.name}</p>
                          <p className="text-xs text-ink/45">{food.isVeg ? "Veg" : "Non-veg"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-ink/70">{food.category}</td>
                    <td className="p-4 font-medium">₹{food.price}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${food.isAvailable ? "bg-olive/15 text-olive" : "bg-ink/10 text-ink/50"}`}>
                        {food.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="p-4 text-ink/60">{food.isFeatured ? "Featured" : food.isPopular ? "Popular" : "—"}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/foods/${food._id}/edit`} className="flex h-8 w-8 items-center justify-center rounded-card border border-ink/15 text-ink/60 hover:bg-ink/5">
                          <Pencil size={14} />
                        </Link>
                        <button onClick={() => setDeleteTarget(food)} className="flex h-8 w-8 items-center justify-center rounded-card border border-ink/15 text-red-500 hover:bg-red-50">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This will permanently remove the item from your menu."
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
};

export default ManageFoods;
