import express from 'express';
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import { connectDB } from './lib/db.js';
import cookieParser from "cookie-parser"
import productRoutes from "./routes/product.route.js"

dotenv.config() //it allows you to retrieve the .env files content
const app = express();
const PORT = process.env.PORT || 5000;

// Important: This middleware must be before routes
app.use(express.json())//allows you to parse the body of request
app.use(cookieParser()) //this will allow to referesh cokie in login

app.use("/api/auth",authRoutes)
app.use("/api/products",productRoutes)


// Add this after your middleware and before routes
app.get('/test', (req, res) => {
    res.json({ message: 'Test route working' });
});

console.log(process.env.PORT)
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    connectDB();
});

// fadmnziOXNFvIvbf   -> mongodb atla password
// (103.159.251.74) ip address

// Add this at the end of your server.js, after all routes
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: "Something went wrong!", 
        error: process.env.NODE_ENV === 'development' ? err.message : {} 
    });
});