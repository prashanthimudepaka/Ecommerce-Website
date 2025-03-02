import mongoose from "mongoose";
export const connectDB =async ()=> {
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI)
    console.log(`mongodb connected :${conn.connection.host}`)

    }
    catch(error)
    {
        console.log("error in connecting to MONGODB",error.message);
        process.exit(1)//if 0 its sucess
    }
    };