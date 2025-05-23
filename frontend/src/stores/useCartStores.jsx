import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { sub } from "framer-motion/client";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  loading: false,

  getCartItems: async () => {
    try {
      const res = await axios.get("/carts");
      set({ cart: res.data });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response?.data?.message || "Failed to fetch cart items");
    }
  },

  addToCart: async (product) => {
    try {
      await axios.post("/carts", { productId: product._id });

      set((prevState) => {
        const existingItem = prevState.cart.find((item) => item._id === product._id);
        
        const newCart=existingItem ? prevState.cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ):[...prevState.cart,{...product,quantity:1}];
        

        return { cart: newCart };
      });
      get().calculateTotals();
      toast.success("Product added to cart successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product to cart");
    }
  },
  removeFromCart: async (productId) => {
    await axios.delete(`/carts`,{data:{productId}});
    toast.success("Product removed from cart successfully!");
    set((prevProducts) => ({
      cart: prevProducts.cart.filter((product) => product._id !== productId),
    }));
    get().calculateTotals();
    toast.success("Product removed from cart successfully!");
  },
  calculateTotals: () => {
    const { cart,coupon }= get();
    const subTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let total=subTotal;
    if(coupon){
      const discount=subTotal*(coupon.discountPercentage/100);
      total=subTotal-discount;
    }
    set({ subTotal,total });
  },
}));
export default useCartStore;