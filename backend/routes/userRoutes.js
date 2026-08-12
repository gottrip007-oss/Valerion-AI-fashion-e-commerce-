import express from "express";
import {
  getProfile,
  updateProfile,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  listCustomers,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/:productId", protect, addToWishlist);
router.delete("/wishlist/:productId", protect, removeFromWishlist);

router.get("/cart", protect, getCart);
router.post("/cart", protect, addToCart);
router.put("/cart/:itemId", protect, updateCartItem);
router.delete("/cart/:itemId", protect, removeCartItem);

router.get("/", protect, admin, listCustomers);

export default router;
