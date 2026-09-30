import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, ClipboardList, UtensilsCrossed, IndianRupee } from "lucide-react";
import { getAdminStats } from "../../api/orderApi.js";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import LoadingSkeleton from "../../components/LoadingSkeleton.jsx";
import OrderStatusBadge from "../../components/OrderStatusBadge.jsx";

const StatCard = ({ icon: Icon, label, value, tint }) => (
  <div className="card-surface p-5">
    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${tint}`}>
      <Icon size={18} />
    </div>
    <p className="mt-4 font-display text-2xl font-semibold">{value}</p>
    <p className="mt-1 text-sm text-ink/55">{label}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getAdminStats();
        setStats(data.stats);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-ink/60">Overview of your restaurant's performance.</p>

      {loading ? (
        <div className="mt-8"><LoadingSkeleton type="spinner" /></div>
      ) : !stats ? (
        <p className="mt-8 text-sm text-ink/50">Could not load statistics.</p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Users} label="Total customers" value={stats.totalUsers} tint="bg-terracotta text-copper" />
            <StatCard icon={ClipboardList} label="Total orders" value={stats.totalOrders} tint="bg-olive/15 text-olive" />
            <StatCard icon={UtensilsCrossed} label="Total products" value={stats.totalProducts} tint="bg-gold/15 text-gold" />
            <StatCard icon={IndianRupee} label="Total revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} tint="bg-copper/15 text-copper" />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="card-surface p-5 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-ink/70">Recent orders</h2>
                <Link to="/admin/orders" className="text-xs font-semibold text-copper">View all</Link>
              </div>
              <div className="mt-4 divide-y divide-ink/10">
                {stats.recentOrders.length === 0 && <p className="py-4 text-sm text-ink/50">No orders yet.</p>}
                {stats.recentOrders.map((order) => (
                  <Link key={order._id} to={`/orders/${order._id}`} className="flex items-center justify-between py-3 text-sm hover:bg-ink/5">
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-xs text-ink/50">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">₹{order.total}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="card-surface p-5">
              <h2 className="text-sm font-semibold text-ink/70">Popular dishes</h2>
              <div className="mt-4 space-y-3">
                {stats.popularFoods.length === 0 && <p className="text-sm text-ink/50">No data yet.</p>}
                {stats.popularFoods.map((food) => (
                  <div key={food._id} className="flex items-center justify-between text-sm">
                    <span className="truncate pr-2">{food.name}</span>
                    <span className="shrink-0 text-ink/50">{food.orderCount} sold</span>
                  </div>
                ))}
              </div>

              <h2 className="mt-6 text-sm font-semibold text-ink/70">Order status</h2>
              <div className="mt-4 space-y-2">
                {Object.entries(stats.statusOverview).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between text-sm">
                    <OrderStatusBadge status={status} />
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
