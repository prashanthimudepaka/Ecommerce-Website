import Order from "../models/order.model.js";
import Coupon from "../models/coupon.model.js";
import Product from "../models/product.model.js";
import { stripe } from "../lib/stripe.js";

export const createCheckoutSession = async (req, res) => {
    try {
        console.log("Received payment request:", { products: req.body.products, couponCode: req.body.couponCode });
        
        const { products, couponCode } = req.body;
        if (!Array.isArray(products) || products.length === 0) {
            console.log("Invalid products array:", products);
            return res.status(400).json({ error: "Invalid or empty products array" });
        }

        // Validate product data
        for (const product of products) {
            if (!product._id || !product.price || !product.name) {
                console.log("Invalid product data:", product);
                return res.status(400).json({ error: "Invalid product data" });
            }
        }

        let totalAmount = 0;
        const lineItems = products.map(product => {
            const amount = Math.round(product.price * 100); // Stripe expects amounts in cents
            totalAmount += amount * product.quantity;
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount: amount,
                },
                quantity: product.quantity || 1,
            };
        });

        console.log("Created line items:", lineItems);

        let coupon = null;
        if (couponCode) {
            coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
            if (coupon) {
                totalAmount -= Math.round(totalAmount * coupon.discountPercentage / 100);
                console.log("Applied coupon:", coupon);
            }
        }

        if (!process.env.CLIENT_URL) {
            throw new Error("CLIENT_URL environment variable is not set");
        }

        console.log("Creating Stripe session with total amount:", totalAmount);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"], // Fixed this here, changed 'cards' to 'card'
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
            discounts: coupon
                ? [
                    {
                        coupon: await createStripeCoupon(coupon.discountPercentage),
                    },
                ]
                : [],
            metadata: {
                userId: req.user._id.toString(),
                couponCode: couponCode || "",
                products: JSON.stringify(
                    products.map((p) => ({
                        id: p._id,
                        quantity: p.quantity,
                        price: p.price,
                    }))
                ),
            }
        });

        console.log("Stripe session created:", session.id);

        if (totalAmount >= 20000) {
            await createNewCoupon(req.user._id);
        }

        res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
    } catch (error) {
        console.error("Error in createCheckoutSession:", {
            message: error.message,
            stack: error.stack,
            type: error.type,
            code: error.code
        });
        res.status(500).json({ 
            message: "Failed to create checkout session", 
            error: error.message,
            type: error.type,
            code: error.code
        });
    }
};

export const checkoutSuccess = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId); // Retrieve session using sessionId

        if (session.payment_status === "paid") {
            if (session.metadata.couponCode) {
                await Coupon.findOneAndUpdate(
                    {
                        code: session.metadata.couponCode,
                        userId: session.metadata.userId,
                    },
                    {
                        isActive: false,
                    }
                );
            }
            const products = JSON.parse(session.metadata.products);
            const newOrder = new Order({
                user: session.metadata.userId,
                products: products.map((product) => ({
                    product: product.id,
                    quantity: product.quantity,
                    price: product.price,
                })),
                totalAmount: session.amount_total / 100, // Convert cents to dollars
                stripeSessionId: session.id,
            });
            await newOrder.save();
            res.status(200).json({
                success: true,
                message:
                    "Payment successful, order created, and coupon deactivated if used",
                orderId: newOrder._id,
            });
        }
    } catch (error) {
        console.error("error processing checkout", error);
        res
            .status(500)
            .json({ message: "Error processing checkout", error: error.message });
    }
};

async function createStripeCoupon(discountPercentage) {
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: "once",
    });
    return coupon.id;
}

async function createNewCoupon(userId) {
    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        userId: userId
    });
    await newCoupon.save();
    return newCoupon;
}
