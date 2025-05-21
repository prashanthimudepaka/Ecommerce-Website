import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,

  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data });
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response?.data?.message || "Failed to fetch cart items");
    }
  },

  addToCart: async (product) => {
    try {
      await axios.post("/cart", { productId: product._id });

      set((prevState) => {
        const existingItem = prevState.cart.find((item) => item._id === product._id);

        let newCart;
        if (existingItem) {
          newCart = prevState.cart.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          newCart = [...prevState.cart, { ...product, quantity: 1 }];
        }

        return { cart: newCart };
      });

      toast.success("Product added to cart successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product to cart");
    }
  },
}));
export default useCartStore;