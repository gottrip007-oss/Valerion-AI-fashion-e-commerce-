import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api/axios.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const refreshCart = useCallback(async () => {
    if (!user) return setCart([]);
    const res = await api.get("/users/cart");
    setCart(res.data.cart);
  }, [user]);

  const refreshWishlist = useCallback(async () => {
    if (!user) return setWishlist([]);
    const res = await api.get("/users/wishlist");
    setWishlist(res.data.wishlist);
  }, [user]);

  useEffect(() => {
    refreshCart();
    refreshWishlist();
  }, [refreshCart, refreshWishlist]);

  const addToCart = async (productId, quantity = 1, size) => {
    const res = await api.post("/users/cart", { productId, quantity, size });
    setCart(res.data.cart);
  };

  const updateCartItem = async (itemId, quantity) => {
    const res = await api.put(`/users/cart/${itemId}`, { quantity });
    setCart(res.data.cart);
  };

  const removeCartItem = async (itemId) => {
    const res = await api.delete(`/users/cart/${itemId}`);
    setCart(res.data.cart);
  };

  const toggleWishlist = async (productId) => {
    const isSaved = wishlist.some((p) => p._id === productId);
    const res = isSaved
      ? await api.delete(`/users/wishlist/${productId}`)
      : await api.post(`/users/wishlist/${productId}`);
    setWishlist(res.data.wishlist);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        updateCartItem,
        removeCartItem,
        toggleWishlist,
        refreshCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
