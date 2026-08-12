import User from "../models/User.js";

// @route GET /api/users/profile
export const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

// @route PUT /api/users/profile
export const updateProfile = async (req, res) => {
  const { name, phone, avatarUrl, addresses } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
  if (addresses !== undefined) user.addresses = addresses;

  await user.save();
  res.json({ user: user.toSafeObject() });
};

// @route GET /api/users/wishlist
export const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.json({ wishlist: user.wishlist });
};

// @route POST /api/users/wishlist/:productId
export const addToWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { productId } = req.params;
  if (!user.wishlist.includes(productId)) {
    user.wishlist.push(productId);
    await user.save();
  }
  const populated = await user.populate("wishlist");
  res.json({ wishlist: populated.wishlist });
};

// @route DELETE /api/users/wishlist/:productId
export const removeFromWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter((id) => id.toString() !== req.params.productId);
  await user.save();
  const populated = await user.populate("wishlist");
  res.json({ wishlist: populated.wishlist });
};

// @route GET /api/users/cart
export const getCart = async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart.product");
  res.json({ cart: user.cart });
};

// @route POST /api/users/cart
export const addToCart = async (req, res) => {
  const { productId, quantity = 1, size } = req.body;
  const user = await User.findById(req.user._id);

  const existing = user.cart.find(
    (item) => item.product.toString() === productId && item.size === size
  );

  if (existing) {
    existing.quantity += Number(quantity);
  } else {
    user.cart.push({ product: productId, quantity, size });
  }

  await user.save();
  const populated = await user.populate("cart.product");
  res.json({ cart: populated.cart });
};

// @route PUT /api/users/cart/:itemId
export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const user = await User.findById(req.user._id);
  const item = user.cart.id(req.params.itemId);
  if (!item) return res.status(404).json({ message: "Cart item not found" });
  item.quantity = quantity;
  await user.save();
  const populated = await user.populate("cart.product");
  res.json({ cart: populated.cart });
};

// @route DELETE /api/users/cart/:itemId
export const removeCartItem = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter((item) => item._id.toString() !== req.params.itemId);
  await user.save();
  const populated = await user.populate("cart.product");
  res.json({ cart: populated.cart });
};

// @route GET /api/users (admin) — list customers
export const listCustomers = async (req, res) => {
  const users = await User.find({ role: "customer" }).select("-password").sort("-createdAt");
  res.json({ users });
};
