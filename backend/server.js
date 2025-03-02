import express from 'express';
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import { connectDB } from './lib/db.js';

dotenv.config() //it allows you to retrieve the .env files content
const app = express();
const PORT = process.env.PORT || 5000;
app.use("/api/auth",authRoutes)
console.log(process.env.PORT)
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    connectDB();
});

// fadmnziOXNFvIvbf
// (103.159.251.74) ip address