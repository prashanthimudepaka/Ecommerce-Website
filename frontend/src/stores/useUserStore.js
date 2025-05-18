import {create} from "zustand"
import axios from "../lib/axios"
import toast from "react-hot-toast"

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,


	signup: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true });

		if (password !== confirmPassword) {
			set({ loading: false });
			return toast.error("Passwords do not match");
		}

		try {
			console.log("Signing up with data:", { name, email, password });
			const res = await axios.post("/auth/signup", { name, email, password });
			set({ user: res.data, loading: false });
			// toast.success("Signup successful!"); // Notify user of success
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "An error occurred");
		}
	},


	login: async ({ email, password }) => {
		set({ loading: true });

		try {
			console.log("login up with data:", {  email, password });
			const res = await axios.post("/auth/login", {  email, password });
			console.log("here is the user", res.data);
			set({ user: res.data, loading: false });
			// toast.success("Signup successful!"); // Notify user of success
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "An error occurred");
		}
	},
	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const res = await axios.get("/auth/profile");
			set({ user: res.data, checkingAuth: false });
		} catch (error) {
			set({ checkingAuth: false, user: null });
		}
	},
}));
/*
import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useUserStore = create((set) => ({
    user: null,
    loading: false,

    signup: async ({ name, email, password }) => {
        set({ loading: true });

        try {
            console.log("Signing up with data:", { name, email, password });
            const res = await axios.post("/auth/signup", { name, email, password });

            set({ user: res.data.user });
            return { success: true, user: res.data.user }; // ✅ Return success
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";
            toast.error(errorMessage);
            return { success: false, error: errorMessage }; // ✅ Return error
        } finally {
            set({ loading: false });
        }
    },
}));

*/