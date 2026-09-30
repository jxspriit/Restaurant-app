import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PackageSearch, ChevronRight } from "lucide-react";
import { getMyOrders } from "../api/orderApi.js";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";
import EmptyState from "../components/EmptyState.jsx";
import OrderStatusBadge from "../components/OrderStatusBadge.jsx";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getMyOrders();
        setOrders(data.orders);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="container-page py-12">
      <h1 className="text-2xl font-semibold">Your orders</h1>
      <p className="mt-1 text-sm text-ink/60">Track current orders and revisit your order history.</p>

      <div className="mt-8">
        {loading ? (
          <LoadingSkeleton type="spinner" />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No orders yet"
            description="Once you place an order, it will show up here."
            action={<Link to="/menu" className="btn-primary">Browse the menu</Link>}
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/orders/${order._id}`}
                className="card-surface flex flex-col gap-3 p-5 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="mt-1 text-sm text-ink/55">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""} · {new Date(order.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">₹{order.total}</span>
                  <OrderStatusBadge status={order.status} />
                  <ChevronRight size={16} className="text-ink/30" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
