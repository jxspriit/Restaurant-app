import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Star, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { getFoodById, getFoods } from "../api/foodApi.js";
import { getReviews, createReview } from "../api/reviewApi.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import FoodCard from "../components/FoodCard.jsx";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");
const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%25' height='100%25' fill='%23EFDCC9'/></svg>";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [food, setFood] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setNotFound(false);
      setQuantity(1);
      setImgError(false);
      window.scrollTo({ top: 0 });
      try {
        const [foodRes, reviewsRes] = await Promise.all([getFoodById(id), getReviews({ foodId: id })]);
        const item = foodRes.data.food;
        setFood(item);
        setReviews(reviewsRes.data.reviews);
        const relatedRes = await getFoods({ category: item.category });
        setRelated(relatedRes.data.foods.filter((f) => f._id !== item._id).slice(0, 3));
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAdd = () => {
    addToCart(food, quantity);
    toast.success(`${quantity} × ${food.name} added to cart`);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) {
      toast.error("Please write a short comment");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await createReview({ food: id, ...reviewForm });
      setReviews((prev) => [data.review, ...prev]);
      setReviewForm({ rating: 5, comment: "" });
      const { data: fresh } = await getFoodById(id);
      setFood(fresh.food);
      toast.success("Thanks for your review");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container-page py-12"><LoadingSkeleton type="spinner" /></div>;
  }

  if (notFound || !food) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-semibold">Dish not found</h1>
        <p className="mt-2 text-sm text-ink/60">This item may have been removed from the menu.</p>
        <Link to="/menu" className="btn-primary mt-6">Back to menu</Link>
      </div>
    );
  }

  const imgSrc = imgError || !food.image ? FALLBACK_IMAGE : food.image.startsWith("http") ? food.image : `${API_ORIGIN}${food.image}`;

  return (
    <div className="container-page py-10">
      <Link to="/menu" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-copper">
        <ArrowLeft size={15} /> Back to menu
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-ink/10 bg-terracotta">
          <img src={imgSrc} onError={() => setImgError(true)} alt={food.name} className="h-full w-full object-cover" />
          {!food.isAvailable && (
            <span className="absolute inset-0 flex items-center justify-center bg-ink/60 text-sm font-semibold text-cream">
              Currently unavailable
            </span>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-terracotta px-3 py-1 text-xs font-semibold text-copper-dark">{food.category}</span>
            <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${food.isVeg ? "border-olive text-olive" : "border-copper text-copper"}`}>
              <span className={`h-2 w-2 rounded-full ${food.isVeg ? "bg-olive" : "bg-copper"}`} />
              {food.isVeg ? "Vegetarian" : "Non-vegetarian"}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">{food.name}</h1>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 font-semibold text-gold">
              <Star size={16} fill="currentColor" /> {food.rating?.toFixed(1)}
            </span>
            <span className="text-ink/50">
              {food.ratingCount > 0 ? `(${food.ratingCount} review${food.ratingCount > 1 ? "s" : ""})` : "(no reviews yet)"}
            </span>
          </div>

          <p className="mt-5 text-ink/65">{food.description}</p>
          <p className="mt-6 font-display text-3xl font-semibold">₹{food.price}</p>

          {food.isAvailable ? (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-4 rounded-card border border-ink/15 px-3 py-2">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="text-copper" aria-label="Decrease quantity"><Minus size={16} /></button>
                <span className="w-6 text-center font-semibold">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="text-copper" aria-label="Increase quantity"><Plus size={16} /></button>
              </div>
              <button onClick={handleAdd} className="btn-primary !px-6 !py-3">
                <ShoppingBag size={16} /> Add to cart · ₹{food.price * quantity}
              </button>
            </div>
          ) : (
            <p className="mt-6 text-sm font-medium text-ink/50">This dish is sold out right now.</p>
          )}
        </div>
      </div>

      <section className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold">Customer reviews</h2>
          {reviews.length === 0 ? (
            <p className="mt-4 rounded-card border border-dashed border-ink/15 p-6 text-sm text-ink/55">
              No reviews for this dish yet. Be the first to share your thoughts.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {reviews.map((r) => (
                <div key={r._id} className="card-surface p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{r.user?.name || "Guest"}</span>
                    <span className="flex text-gold">
                      {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-ink/65">{r.comment}</p>
                  <p className="mt-2 text-xs text-ink/40">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-fit card-surface p-6">
          <h3 className="font-display text-lg font-semibold">Write a review</h3>
          {isAuthenticated ? (
            <form onSubmit={handleReview} className="mt-4 space-y-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: n })} aria-label={`${n} stars`}>
                    <Star size={24} className="text-gold" fill={n <= reviewForm.rating ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
              <textarea
                rows={4}
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                className="input-field resize-none"
                placeholder="How was it?"
              />
              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? "Submitting..." : "Submit review"}
              </button>
            </form>
          ) : (
            <p className="mt-3 text-sm text-ink/60">
              <Link to="/login" state={{ from: { pathname: `/menu/${id}` } }} className="font-semibold text-copper">Log in</Link> to leave a review.
            </p>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold">More from {food.category}</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((f) => <FoodCard key={f._id} food={f} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
