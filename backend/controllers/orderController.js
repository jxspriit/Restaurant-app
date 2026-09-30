import Order from "../models/Order.js";
import Food from "../models/Food.js";

const DELIVERY_FEE = 40;

export const placeOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress, customerName, notes, paymentMethod } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cannot place an order with no items" });
    }
    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.phone) {
      return res.status(400).json({ success: false, message: "A complete delivery address is required" });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const food = await Food.findById(item.foodId);
      if (!food) {
        return res.status(404).json({ success: false, message: `Food item not found: ${item.foodId}` });
      }
      subtotal += food.price * item.quantity;
      orderItems.push({
        food: food._id,
        name: food.name,
        price: food.price,
        quantity: item.quantity,
        image: food.image,
      });
      food.orderCount += item.quantity;
      await food.save();
    }

    const total = subtotal + DELIVERY_FEE;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      deliveryAddress,
      customerName: customerName || req.user.name,
      subtotal,
      deliveryFee: DELIVERY_FEE,
      total,
      notes,
      paymentMethod: paymentMethod || "Cash on Delivery",
    });

    res.status(201).json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    const isOwner = order.user._id.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "You do not have access to this order" });
    }
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You do not have access to this order" });
    }
    if (order.status !== "Pending") {
      return res.status(400).json({ success: false, message: "Only pending orders can be cancelled" });
    }
    order.status = "Cancelled";
    await order.save();
    res.json({ success: true, message: "Order cancelled", order });
  } catch (error) {
    next(error);
  }
};
