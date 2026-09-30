import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { getFoods } from "../api/foodApi.js";
import FoodCard from "../components/FoodCard.jsx";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";
import EmptyState from "../components/EmptyState.jsx";

const categories = ["All", "Pizza", "Burgers", "Pasta", "Indian", "Chinese", "Desserts", "Drinks"];

const sortOptions = [
  { value: "", label: "Recommended" },
  { value: "popularity", label: "Most popular" },
  { value: "rating", label: "Highest rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [veg, setVeg] = useState("all");
  const [sort, setSort] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const load = async () => {
        setLoading(true);
        try {
          const params = { sort };
          if (search) params.search = search;
          if (category !== "All") params.category = category;
          if (veg !== "all") params.veg = veg;
          const { data } = await getFoods(params);
          setFoods(data.foods);
        } catch {
          setFoods([]);
        } finally {
          setLoading(false);
        }
      };
      load();
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, category, veg, sort]);

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Our menu</h1>
        <p className="mt-1.5 text-sm text-ink/60">Wood-fired, slow-cooked, and made fresh to order.</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search dishes..." className="input-field !pl-10" />
        </div>

        <div className="flex items-center gap-3">
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field !w-auto text-sm">
            {sortOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <button onClick={() => setFiltersOpen((v) => !v)} className="btn-secondary !px-4 !py-2.5 sm:hidden">
            <SlidersHorizontal size={15} /> Filters
          </button>
        </div>
      </div>

      <div className={`mb-8 flex flex-col gap-4 sm:flex ${filtersOpen ? "flex" : "hidden sm:flex"}`}>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                category === cat ? "border-copper bg-copper text-cream" : "border-ink/15 text-ink/70 hover:bg-ink/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {[
            { value: "all", label: "All" },
            { value: "true", label: "Vegetarian" },
            { value: "false", label: "Non-vegetarian" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setVeg(opt.value)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                veg === opt.value ? "border-olive bg-olive text-cream" : "border-ink/15 text-ink/60 hover:bg-ink/5"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton rows={9} />
      ) : foods.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {foods.map((food) => <FoodCard key={food._id} food={food} />)}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No dishes match your filters"
          description="Try a different search term or clear your filters to see the full menu."
        />
      )}
    </div>
  );
};

export default Menu;
