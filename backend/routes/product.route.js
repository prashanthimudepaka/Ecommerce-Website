import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductsByCategory,
  getRecommendedProducts,
  deleteProduct,
  getFeaturedProducts,
  toggleFeaturedProduct,
} from "../controllers/product.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import cloudinary from "cloudinary";

const router = express.Router();

// Add test route for Cloudinary
router.get("/test-cloudinary", async (req, res) => {
    try {
        const result = await cloudinary.api.ping();
        console.log("Cloudinary test result:", result);
        
        // Try to get account info
        const accountInfo = await cloudinary.api.account();
        console.log("Cloudinary account info:", {
            cloud_name: accountInfo.cloud_name,
            plan: accountInfo.plan,
            credits: accountInfo.credits
        });

        res.json({ 
            message: "Cloudinary is configured correctly",
            status: "success",
            account: {
                cloud_name: accountInfo.cloud_name,
                plan: accountInfo.plan
            }
        });
    } catch (error) {
        console.error("Cloudinary test error:", error);
        res.status(500).json({ 
            message: "Cloudinary configuration error",
            error: error.message
        });
    }
});

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);
router.post("/", protectRoute, adminRoute, createProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
// router.put("/:id", protectRoute, adminRoute, updateProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
