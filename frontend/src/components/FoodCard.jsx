import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Plus, Minus } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import toast from "react-hot-toast";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%25' height='100%25' fill='%23EFDCC9'/></svg>";

const FoodCard = ({ food }) => {
  const { items, addToCart, increaseQuantity, decreaseQuantity } = useCart();
  const [imgError, setImgError] = useState(false);
  const cartItem = items.find((item) => item.foodId === food._id);

  const handleAdd = () => {
    addToCart(food);
    toast.success(`${food.name} added to cart`);
  };

  const apiOrigin = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");
  const imgSrc = imgError || !food.image ? FALLBACK_IMAGE : food.image.startsWith("http") ? food.image : `${apiOrigin}${food.image}`;

  return (
    <div className="card-surface group flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <Link to={`/menu/${food._id}`} className="relative block aspect-[4/3] overflow-hidden bg-terracotta">
        <img
          src={imgSrc}
          onError={() => setImgError(true)}
          alt={food.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <span
          className={`absolute left-3 top-3 flex h-5 w-5 items-center justify-center rounded-sm border-2 ${
            food.isVeg ? "border-olive bg-white" : "border-copper bg-white"
          }`}
          title={food.isVeg ? "Vegetarian" : "Non-vegetarian"}
        >
          <span className={`h-2 w-2 rounded-full ${food.isVeg ? "bg-olive" : "bg-copper"}`} />
        </span>
        {!food.isAvailable && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink/60 text-sm font-semibold text-cream">
            Currently unavailable
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/menu/${food._id}`} className="hover:text-copper"><h3 className="font-display text-base font-semibold leading-snug">{food.name}</h3></Link>
          <div className="flex shrink-0 items-center gap-1 text-xs font-medium text-gold">
            <Star size={13} fill="currentColor" />
            {food.rating?.toFixed(1) ?? "4.5"}
          </div>
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm text-ink/60">{food.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-lg font-semibold">₹{food.price}</span>

          {food.isAvailable === false ? (
            <span className="text-xs text-ink/40">Sold out</span>
          ) : cartItem ? (
            <div className="flex items-center gap-3 rounded-card border border-ink/15 px-2 py-1">
              <button onClick={() => decreaseQuantity(food._id)} className="flex h-6 w-6 items-center justify-center text-copper" aria-label="Decrease quantity">
                <Minus size={14} />
              </button>
              <span className="w-4 text-center text-sm font-semibold">{cartItem.quantity}</span>
              <button onClick={() => increaseQuantity(food._id)} className="flex h-6 w-6 items-center justify-center text-copper" aria-label="Increase quantity">
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button onClick={handleAdd} className="btn-primary !px-3 !py-1.5 !text-xs">
              Add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
