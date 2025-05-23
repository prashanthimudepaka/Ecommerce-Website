import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        
        // Find if product already exists in cart
        const existingItem = user.cartItems.find(item => item.product.toString() === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push({
                product: productId,
                quantity: 1
            });
        }
        
        await user.save();
        res.json({ message: "Product added to cart" });
    } catch (error) {
        console.log("error in add to cart controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const removeAllFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        if (!productId) {
            user.cartItems = []; //remove all items from cart
        } else {
            user.cartItems = user.cartItems.filter(item => item.product.toString() !== productId);
        }
        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.log("error in remove all from cart controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const { id: productId, quantity } = req.params;
        const user = req.user;
        const existingItem = user.cartItems.find(item => item.product.toString() === productId);
        
        if (existingItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter(item => item.product.toString() !== productId);
                await user.save();
                return res.json(user.cartItems);
            }
            existingItem.quantity = quantity;
            await user.save();
            return res.json(user.cartItems);
        } else {
            res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.log("error in update quantity controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getCartProducts = async (req, res) => {
    try {
        const user = req.user;
        const productIds = user.cartItems.map(item => item.product);
        
        const products = await Product.find({ _id: { $in: productIds } });
        
        // Add quantity to each product
        const cartItems = products.map(product => {
            const cartItem = user.cartItems.find(item => item.product.toString() === product._id.toString());
            return {
                ...product.toObject(),
                quantity: cartItem ? cartItem.quantity : 1
            };
        });
        
        res.json(cartItems);
    } catch (error) {
        console.log("error in get cart products controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
