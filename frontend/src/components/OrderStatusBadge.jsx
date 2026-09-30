const statusStyles = {
  Pending: "bg-gold/15 text-gold",
  Confirmed: "bg-copper/15 text-copper",
  Preparing: "bg-copper/15 text-copper",
  "Out for Delivery": "bg-olive/15 text-olive",
  Delivered: "bg-olive/20 text-olive",
  Cancelled: "bg-red-100 text-red-600",
};

const OrderStatusBadge = ({ status }) => {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status] || "bg-ink/10 text-ink/60"}`}>
      {status}
    </span>
  );
};

export default OrderStatusBadge;
