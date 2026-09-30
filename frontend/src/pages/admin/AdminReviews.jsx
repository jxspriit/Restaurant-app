import { useEffect, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { getReviews, deleteReview } from "../../api/reviewApi.js";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import LoadingSkeleton from "../../components/LoadingSkeleton.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    try {
      const { data } = await getReviews();
      setReviews(data.reviews);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    try {
      await deleteReview(deleteTarget._id);
      toast.success("Review removed");
      setReviews((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete review");
      setDeleteTarget(null);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold">Customer reviews</h1>
      <p className="mt-1 text-sm text-ink/60">{reviews.length} reviews across the menu</p>

      <div className="mt-6">
        {loading ? (
          <LoadingSkeleton type="spinner" />
        ) : reviews.length === 0 ? (
          <EmptyState title="No reviews yet" description="Customer reviews will appear here." />
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review._id} className="card-surface flex items-start justify-between gap-4 p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex text-gold">
                      {Array.from({ length: review.rating }).map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
                    </div>
                    <span className="text-sm font-semibold">{review.user?.name || "Guest"}</span>
                  </div>
                  <p className="mt-2 text-sm text-ink/65">{review.comment}</p>
                  <p className="mt-2 text-xs text-ink/40">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <button onClick={() => setDeleteTarget(review)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-card border border-ink/15 text-red-500 hover:bg-red-50">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this review?"
        description="This action can't be undone."
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
};

export default AdminReviews;
