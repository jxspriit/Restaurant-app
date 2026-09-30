import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import { getAllOrders, updateOrderStatus } from "../../api/orderApi.js";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import LoadingSkeleton from "../../components/LoadingSkeleton.jsx";
import OrderStatusBadge from "../../components/OrderStatusBadge.jsx";
import EmptyState from "../../components/EmptyState.jsx";

const statuses = ["All", "Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (status !== "All") params.status = status;
      if (search) params.search = search;
      const { data } = await getAllOrders(params);
      setOrders(data.orders);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(load, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, search]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated");
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update status");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold">Manage orders</h1>
      <p className="mt-1 text-sm text-ink/60">{orders.length} orders</p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or phone..." className="input-field !pl-10" />
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                status === s ? "border-copper bg-copper text-cream" : "border-ink/15 text-ink/60 hover:bg-ink/5"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <LoadingSkeleton type="spinner" />
        ) : orders.length === 0 ? (
          <EmptyState title="No orders found" description="Try a different filter or search term." />
        ) : (
          <div className="overflow-x-auto rounded-card border border-ink/10 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left text-xs font-semibold uppercase tracking-wide text-ink/40">
                  <th className="p-4">Order</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-ink/5 last:border-0">
                    <td className="p-4">
                      <Link to={`/orders/${order._id}`} className="font-medium text-copper">#{order._id.slice(-8).toUpperCase()}</Link>
                      <p className="text-xs text-ink/45">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4">
                      <p>{order.customerName}</p>
                      <p className="text-xs text-ink/45">{order.deliveryAddress?.phone}</p>
                    </td>
                    <td className="p-4 text-ink/60">{order.items.length}</td>
                    <td className="p-4 font-medium">₹{order.total}</td>
                    <td className="p-4"><OrderStatusBadge status={order.status} /></td>
                    <td className="p-4">
                      <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} className="input-field !w-auto !py-1.5 text-xs">
                        {statuses.slice(1).map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageOrders;
