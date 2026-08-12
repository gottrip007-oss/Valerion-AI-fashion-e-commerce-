import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// @route GET /api/admin/dashboard
export const getDashboardStats = async (req, res) => {
  const [totalOrders, totalCustomers, totalProducts, orders] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: "customer" }),
    Product.countDocuments(),
    Order.find().select("totalPrice status createdAt"),
  ]);

  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const statusBreakdown = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
    .select("name stock sku")
    .limit(10);

  res.json({
    totalOrders,
    totalCustomers,
    totalProducts,
    totalRevenue,
    statusBreakdown,
    lowStockProducts,
  });
};
