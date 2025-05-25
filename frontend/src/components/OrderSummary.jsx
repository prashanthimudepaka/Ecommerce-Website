import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStores";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-hot-toast";
import axios from "../lib/axios"; // custom axios instance

const stripePromise = loadStripe("pk_test_51R6BEwKxBSCPA4RcjLAdH9DNiZTqUsvbxKYCmP0CZ68AUnxAdC81NIGWnElcMfPyIDuX7ctdYjbwIBytR39dbJpp00D9gOH7Rd");

const OrderSummary = () => {
	const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

	const savings = subtotal - total;
	const formattedSubtotal = subtotal.toFixed(2);
	const formattedTotal = total.toFixed(2);
	const formattedSavings = savings.toFixed(2);

	const handlePayment = async () => {
		if (!cart.length) {
			toast.error("Your cart is empty!");
			return;
		}

		const stripe = await stripePromise;
		console.log("Sending cart:", cart);

		try {
			const res = await axios.post("/payments/create-checkout-session", {
				products: cart,
				couponCode: coupon ? coupon.code : null,
			});

			const session = res.data;
			console.log("Checkout session:", session);
			const result = await stripe.redirectToCheckout({
				sessionId: session.id,
			});

			if (result.error) {
				console.error("Stripe error:", result.error.message);
				toast.error(result.error.message);
			}
		} catch (error) {
			console.error("Checkout error:", error);
			toast.error("Something went wrong during checkout.");
		}
	};

	return (
		<motion.div
			className='w-full space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<p className='text-xl font-semibold text-emerald-400'>Order summary</p>

			<div className='space-y-4'>
				<div className='space-y-2'>
					<dl className=' justify-between'>
						<dt className='text-gray-300'>Original price</dt>
						<dd className='text-white'>${formattedSubtotal}</dd>
					</dl>

					{savings > 0 && (
						<dl className='flex justify-between'>
							<dt className='text-gray-300'>Savings</dt>
							<dd className='text-emerald-400'>-${formattedSavings}</dd>
						</dl>
					)}

					{coupon && isCouponApplied && (
						<dl className='flex justify-between'>
							<dt className='text-gray-300'>Coupon ({coupon.code})</dt>
							<dd className='text-emerald-400'>-{coupon.discountPercentage}%</dd>
						</dl>
					)}

					<dl className='flex justify-between border-t border-gray-600 pt-2'>
						<dt className='font-bold text-white'>Total</dt>
						<dd className='font-bold text-emerald-400'>${formattedTotal}</dd>
					</dl>
				</div>

				<motion.button
					className='w-full rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handlePayment}
				>
					Proceed to Checkout
				</motion.button>

				<div className='flex items-center justify-center gap-2'>
					<span className='text-sm text-gray-400'>or</span>
					<Link
						to='/'
						className='text-sm font-medium text-emerald-400 underline hover:text-emerald-300 flex items-center gap-1'
					>
						Continue Shopping
						<MoveRight size={16} />
					</Link>
				</div>
			</div>
		</motion.div>
	);
};

export default OrderSummary;