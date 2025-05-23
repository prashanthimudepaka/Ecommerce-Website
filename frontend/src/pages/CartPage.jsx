import React from 'react'
import useCartStore from '../stores/useCartStores'
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import CartItem from '../components/CartItem';
import PeopleAlsoBought from '../components/PeopleAlsoBought';
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * CartPage component renders the shopping cart page.
 * 
 * This component displays a list of items in the user's cart. If the cart is empty,
 * it shows a message with a link to start shopping. If there are items in the cart,
 * it lists each item using the CartItem component and suggests products that people
 * also bought via the PeopleAlsoBought component.
 * 
 * The layout is responsive, utilizing motion animations for transitions.
 */

/*******  21f2ac0e-cd5c-479c-b2d9-225ed391a121  *******/
const CartPage = () => {
	const { cart } = useCartStore();

	return (
		<div className='py-8 md:py-16'>
			<div className='mx-auto max-w-screen-xl px-4 2xl:px-0'>
				<div className='mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8'>
					<motion.div
						className='mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl'
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						{cart.length === 0 ? (
							<EmptyCartUI />
						) : (
							<div className='space-y-6'>
								{cart.map((item) => (
									<CartItem key={item._id} item={item} />
								))}
							</div>
						)}
						{cart.length > 0 && <PeopleAlsoBought />}
					</motion.div>
            </div>
        </div>
    </div>

  )
}


export default CartPage
const EmptyCartUI = () => {
    return (
        <motion.div
            className='flex flex-col items-center justify-center space-y-4 py-16'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <ShoppingCart className='h-24 w-24 text-gray-400' />
            <h3 className='text-2xl font-semibold text-gray-900'>Your cart is empty</h3>
            <p className='text-sm text-gray-500'>Start shopping to add items to your cart.</p>
            <Link
                className='mt-4 rounded-md bg-emerald-500 py-2 px-4 text-white transition-colors hover:bg-emerald-600'
                to='/'
            >
                Start Shopping
            </Link>
        </motion.div>
    );
}
