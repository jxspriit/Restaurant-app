import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Circle, MapPin, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { getOrderById, cancelOrder } from "../api/orderApi.js";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";
import OrderStatusBadge from "../components/OrderStatusBadge.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

const STAGES = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered"];

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const load = async () => {
    try {
      const { data } = await getOrderById(id);
      setOrder(data.order);
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = async () => {
    try {
      await cancelOrder(id);
      toast.success("Order cancelled");
      setConfirmOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel order");
      setConfirmOpen(false);
    }
  };

  if (loading) return <LoadingSkeleton type="spinner" />;
  if (!order) {
    return (
      <div className="container-page py-16 text-center">
        <p className="text-ink/60">Order not found.</p>
        <Link to="/orders" className="mt-4 inline-block text-copper font-semibold">Back to orders</Link>
      </div>
    );
  }

  const currentStageIndex = STAGES.indexOf(order.status);

  return (
    <div className="container-page max-w-3xl py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="mt-1 text-sm text-ink/60">
            Placed on {new Date(order.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {order.status !== "Cancelled" ? (
        <div className="mt-8 rounded-card border border-ink/10 bg-white p-6">
          <div className="flex items-center justify-between">
            {STAGES.map((stage, i) => (
              <div key={stage} className="flex flex-1 flex-col items-center text-center">
                <div className="flex w-full items-center">
                  {i !== 0 && <div className={`h-0.5 flex-1 ${i <= currentStageIndex ? "bg-copper" : "bg-ink/10"}`} />}
                  {i <= currentStageIndex ? (
                    <CheckCircle2 size={20} className="shrink-0 text-copper" />
                  ) : (
                    <Circle size={20} className="shrink-0 text-ink/20" />
                  )}
                  {i !== STAGES.length - 1 && <div className={`h-0.5 flex-1 ${i < currentStageIndex ? "bg-copper" : "bg-ink/10"}`} />}
                </div>
                <span className={`mt-2 text-[11px] font-medium ${i <= currentStageIndex ? "text-ink" : "text-ink/40"}`}>{stage}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-card border border-red-200 bg-red-50 p-4 text-sm text-red-600">This order was cancelled.</div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="card-surface p-5">
          <h3 className="text-sm font-semibold text-ink/70">Delivery address</h3>
          <p className="mt-2 flex items-start gap-2 text-sm text-ink/70">
            <MapPin size={15} className="mt-0.5 shrink-0 text-copper" />
            {order.deliveryAddress.street}, {order.deliveryAddress.city}
            {order.deliveryAddress.state ? `, ${order.deliveryAddress.state}` : ""} {order.deliveryAddress.zip}
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-ink/70">
            <Phone size={15} className="text-copper" /> {order.deliveryAddress.phone}
          </p>
        </div>
        <div className="card-surface p-5">
          <h3 className="text-sm font-semibold text-ink/70">Payment</h3>
          <p className="mt-2 text-sm text-ink/70">{order.paymentMethod}</p>
          {order.notes && (
            <>
              <h3 className="mt-4 text-sm font-semibold text-ink/70">Notes</h3>
              <p className="mt-1 text-sm text-ink/70">{order.notes}</p>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 card-surface divide-y divide-ink/10">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 text-sm">
            <span>{item.quantity} × {item.name}</span>
            <span className="font-medium">₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="space-y-2 p-4 text-sm">
          <div className="flex justify-between text-ink/60"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
          <div className="flex justify-between text-ink/60"><span>Delivery fee</span><span>₹{order.deliveryFee}</span></div>
          <div className="flex justify-between text-base font-semibold"><span>Total</span><span>₹{order.total}</span></div>
        </div>
      </div>

      {order.status === "Pending" && (
        <button onClick={() => setConfirmOpen(true)} className="mt-6 text-sm font-semibold text-red-500">Cancel this order</button>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Cancel this order?"
        description="This action can't be undone."
        confirmLabel="Cancel order"
        danger
        onConfirm={handleCancel}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default OrderDetails;
