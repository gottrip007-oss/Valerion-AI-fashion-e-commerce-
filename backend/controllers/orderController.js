import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

// @route POST /api/orders
export const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ message: "Order must contain at least one item" });
  }

  // Re-price server-side from the DB — never trust client-sent prices.
  let itemsPrice = 0;
  const orderItems = [];

  for (const cartItem of items) {
    const product = await Product.findById(cartItem.product);
    if (!product) {
      return res.status(404).json({ message: `Product ${cartItem.product} not found` });
    }
    if (product.stock < cartItem.quantity) {
      return res.status(400).json({ message: `${product.name} is out of stock` });
    }
    itemsPrice += product.price * cartItem.quantity;
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: cartItem.quantity,
      size: cartItem.size,
    });
  }

  const shippingPrice = itemsPrice > 15000 ? 0 : 250;
  const taxPrice = Math.round(itemsPrice * 0.05);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || "razorpay",
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  // Decrement stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
  }

  // Clear the user's cart
  await User.findByIdAndUpdate(req.user._id, { $set: { cart: [] } });

  res.status(201).json({ order });
};

// @route GET /api/orders/my
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
  res.json({ orders });
};

// @route GET /api/orders/:id
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) return res.status(404).json({ message: "Order not found" });

  const isOwner = order.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized to view this order" });
  }

  res.json({ order });
};

// @route GET /api/orders (admin) — all orders
export const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort("-createdAt");
  res.json({ orders });
};

// @route PUT /api/orders/:id/status (admin)
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = status;
  if (status === "Delivered") order.deliveredAt = new Date();
  await order.save();

  res.json({ order });
};

// @route PUT /api/orders/:id/pay
// Marks an order paid after a (sandbox) Razorpay payment completes on the client.
export const markOrderPaid = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.isPaid = true;
  order.paidAt = new Date();
  order.status = "Confirmed";
  order.paymentResult = {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    status: "paid",
  };

  await order.save();
  res.json({ order });
};
