import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
	products: [],
	loading: false,

	setProducts: (products) => set({ products }),
	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/products", productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
			toast.success("Product created successfully!");
		} catch (error) {
			console.error("Error creating product:", error);
			toast.error(error.response?.data?.message || "Failed to create product");
			set({ loading: false });
			throw error;
		}
	},
	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products");
			set({ products: response.data, loading: false });
		} catch (error) {
			console.error("Error fetching products:", error);
			toast.error(error.response?.data?.message || "Failed to fetch products");
			set({ loading: false });
		}
	},
	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/category/${category}`);
			set({ products: response.data, loading: false });
		} catch (error) {
			console.error("Error fetching products by category:", error);
			toast.error(error.response?.data?.message || "Failed to fetch products");
			set({ loading: false });
		}
	},
	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
			toast.success("Product deleted successfully!");
		} catch (error) {
			console.error("Error deleting product:", error);
			toast.error(error.response?.data?.message || "Failed to delete product");
			set({ loading: false });
		}
	},
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				),
				loading: false,
			}));
			toast.success("Product updated successfully!");
		} catch (error) {
			console.error("Error updating product:", error);
			toast.error(error.response?.data?.message || "Failed to update product");
			set({ loading: false });
		}
	},
	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			set({ products: response.data, loading: false });
		} catch (error) {
			console.error("Error fetching featured products:", error);
			toast.error(error.response?.data?.message || "Failed to fetch featured products");
			set({ loading: false });
		}
	}
}));