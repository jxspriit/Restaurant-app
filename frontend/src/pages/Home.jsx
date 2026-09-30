import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Leaf, Clock, Star, MapPin, Phone } from "lucide-react";
import { getFoods } from "../api/foodApi.js";
import { getReviews } from "../api/reviewApi.js";
import FoodCard from "../components/FoodCard.jsx";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [popular, setPopular] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [featuredRes, popularRes, reviewsRes] = await Promise.all([
          getFoods({ featured: "true" }),
          getFoods({ popular: "true" }),
          getReviews(),
        ]);
        setFeatured(featuredRes.data.foods.slice(0, 4));
        setPopular(popularRes.data.foods.slice(0, 4));
        setReviews(reviewsRes.data.reviews.slice(0, 3));
      } catch {
        // fail silently on homepage widgets
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <section className="border-b border-ink/10 bg-cream">
        <div className="container-page grid grid-cols-1 items-center gap-12 py-14 md:grid-cols-2 md:py-20">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-3 py-1 text-xs font-semibold text-copper-dark">
              <Flame size={13} /> Wood-fired since 2014
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              Honest food, cooked slow, delivered fast.
            </h1>
            <p className="mt-5 max-w-md text-base text-ink/65">
              From our wood-fired oven to handmade pasta and slow-simmered curries — every dish at
              Copperleaf Kitchen is made the way we'd cook for our own table.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/menu" className="btn-primary">View the menu <ArrowRight size={16} /></Link>
              <a href="#about" className="btn-secondary">Our story</a>
            </div>
            <div className="mt-10 flex gap-8 border-t border-ink/10 pt-6">
              <div><p className="font-display text-2xl font-semibold">10+</p><p className="text-xs text-ink/50">Years serving Hisar</p></div>
              <div><p className="font-display text-2xl font-semibold">40k+</p><p className="text-xs text-ink/50">Happy orders</p></div>
              <div><p className="font-display text-2xl font-semibold">4.8</p><p className="text-xs text-ink/50">Average rating</p></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-card border border-ink/10 bg-terracotta">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&q=80"
                alt="Wood-fired pizza fresh from the oven at Copperleaf Kitchen"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden w-48 rounded-card border border-ink/10 bg-white p-4 shadow-lg sm:block">
              <div className="flex items-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
              </div>
              <p className="mt-1.5 text-xs text-ink/60">"Best butter chicken in the city, hands down."</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Featured dishes</h2>
            <p className="mt-1 text-sm text-ink/60">Chef's picks, made fresh every day.</p>
          </div>
          <Link to="/menu" className="hidden items-center gap-1 text-sm font-semibold text-copper sm:flex">Full menu <ArrowRight size={14} /></Link>
        </div>
        {loading ? (
          <LoadingSkeleton rows={4} />
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((food) => <FoodCard key={food._id} food={food} />)}
          </div>
        ) : (
          <p className="text-sm text-ink/50">Featured dishes will appear here once the menu is seeded.</p>
        )}
      </section>

      <section className="border-y border-ink/10 bg-terracotta/40 py-16">
        <div className="container-page">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-semibold sm:text-3xl">Popular right now</h2>
              <p className="mt-1 text-sm text-ink/60">What Hisar is ordering this week.</p>
            </div>
          </div>
          {loading ? (
            <LoadingSkeleton rows={4} />
          ) : popular.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {popular.map((food) => <FoodCard key={food._id} food={food} />)}
            </div>
          ) : (
            <p className="text-sm text-ink/50">Popular dishes will appear here once orders start coming in.</p>
          )}
        </div>
      </section>

      <section id="about" className="container-page grid grid-cols-1 items-center gap-12 py-16 md:grid-cols-2">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
          alt="Chef preparing a dish in the Copperleaf Kitchen"
          className="aspect-[4/3] w-full rounded-card border border-ink/10 object-cover"
        />
        <div>
          <h2 className="text-2xl font-semibold sm:text-3xl">A kitchen built on three things</h2>
          <p className="mt-4 text-ink/65">
            Copperleaf Kitchen started as a single wood-fired oven and a family recipe book. A decade on,
            we still cook the same way: real ingredients, unhurried technique, and a menu small enough
            that every dish gets our full attention.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div><Flame className="text-copper" size={22} /><p className="mt-3 text-sm font-semibold">Wood-fired</p><p className="mt-1 text-xs text-ink/55">Our oven runs hot, all day, every day.</p></div>
            <div><Leaf className="text-olive" size={22} /><p className="mt-3 text-sm font-semibold">Fresh sourced</p><p className="mt-1 text-xs text-ink/55">Produce delivered from local farms daily.</p></div>
            <div><Clock className="text-gold" size={22} /><p className="mt-3 text-sm font-semibold">Made to order</p><p className="mt-1 text-xs text-ink/55">Nothing is cooked until you've ordered it.</p></div>
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="border-t border-ink/10 bg-ink py-16 text-cream">
          <div className="container-page">
            <h2 className="text-2xl font-semibold sm:text-3xl">What our guests say</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {reviews.map((review) => (
                <div key={review._id} className="rounded-card border border-cream/15 p-5">
                  <div className="flex gap-1 text-gold">
                    {Array.from({ length: review.rating }).map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
                  </div>
                  <p className="mt-3 text-sm text-cream/75">{review.comment}</p>
                  <p className="mt-4 text-xs font-semibold text-cream/50">— {review.user?.name || "Guest"}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-page py-16">
        <div className="grid grid-cols-1 gap-8 rounded-card border border-ink/10 bg-white p-8 sm:grid-cols-2 sm:p-10">
          <div>
            <h2 className="text-2xl font-semibold">Visit or order in</h2>
            <p className="mt-3 max-w-sm text-sm text-ink/60">
              Walk in for dinner or place an order online — we deliver across Hisar in under 40 minutes.
            </p>
            <div className="mt-6 space-y-3 text-sm text-ink/70">
              <p className="flex items-center gap-2"><MapPin size={16} className="text-copper" /> 42 Ember Lane, Hisar, Haryana 125001</p>
              <p className="flex items-center gap-2"><Phone size={16} className="text-copper" /> +91 98765 43210</p>
              <p className="flex items-center gap-2"><Clock size={16} className="text-copper" /> Open daily, 11am – 11pm</p>
            </div>
          </div>
          <div className="flex items-center justify-center rounded-card bg-terracotta">
            <Link to="/contact" className="btn-primary">Get directions <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
