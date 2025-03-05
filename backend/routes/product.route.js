import express from "express";
import { getAllProducts, getFeaturedProducts } from "../controllers/product.controller.js";
import { protectRoute, admin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, admin, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.post("/", protectRoute, adminRoute, createProduct);



export default router;    
