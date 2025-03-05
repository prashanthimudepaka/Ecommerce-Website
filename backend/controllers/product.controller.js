import redis from "../lib/redis.js";
import Product from "../models/product.model.js"

export const getAllProducts = async (req, res) => {
    //only admin should this method
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.log("error in get all products controller", error.message);
        res.status(500).json({ message: error.message });
    }
}



export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//if not in redis, fetch from db and store in redis
//.lean() is used to return the data in plain javascript object
//redis is used to store the data in the memory and it is used to store the data in the memory and it is used to store the data in the memory
export const getFeaturedProducts = async (req, res) => {
    try{
        let featuredProducts=await redis.get("featuredProducts");
        if(featuredProducts){
            return res.json(JSON.parse(featuredProducts));
        }
       featuredProducts=await Product.find({isFeatured:true}).lean();
       if(!featuredProducts){
        return res.status(404).json({message:"No featured products found"});
       }
       await redis.set("featuredProducts",JSON.stringify(featuredProducts));
       res.json(featuredProducts);
    } catch (error) {
        console.log("error in get featured products controller", error.message);
        res.status(500).json({ message: error.message });
    }
}
