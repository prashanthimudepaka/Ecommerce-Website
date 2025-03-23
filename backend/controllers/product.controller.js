import redis from "../lib/redis.js";
import Product from "../models/product.model.js"
import cloudinary from "../lib/cloudinary.js"

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

export const getRecommendedProducts = async (req, res) => {
    try{
        const products=await Product.aggregate([
            {$sample:{size:3}
        },
        {$project:{
            _id:1,
            name:1,
            description:1,
            image:1,
            price:1}}
        ])
        res.json(products);
    } catch (error) {
        console.log("error in get recommended products controller", error.message);
        res.status(500).json({ message: "server error",error: error.message });
    }
}

export const createProduct = async (req, res) => {
    try {
        const {name,description, price, image, category}=req.body;
        let cloudinaryResponse=null;
        if(image) {
            cloudinaryResponse=await cloudinary.uploader.upload(image, {folder:"products"})
        const product = await Product.create({
            name,
            description,
            price,
            image:cloudinaryResponse?.secure_url?cloudinaryResponse.secure_url:"",
            category,    
        });
        res.status(201).json(product);
    }
    } catch (error) {
        console.log("error in create product controller", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const {id}=req.params;
        const product=await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        if(product.image){
            const publicId=product.image.split("/").pop().split(".")[0];//to get id of the image from the url of the image in cloudinary and then split the id from the url and then split the id from the url and then split the id from the url
        try{
            await cloudinary.uploader.destroy(`products/${publicId}`);
            console.log("image deleted from cloudinary");  
        } catch (error) {
            console.log("error in delete product controller", error);
            // res.status(500).json({ message:"Server error",error: error.message });
        }
        }
        
        await product.findByIdAndDelete(req.params.id);
        res.json({message:"Product deleted successfully"});
    } catch (error) {
        console.log("error in delete product controller", error.message);
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

export const getProductsByCategory = async (req, res) => {
    try{
        const {category}=req.params;
        const products=await Product.find({category});
        
        res.json(products);
    } catch (error) {
        console.log("error in get products by category controller", error.message);
        res.status(500).json({ message:"Server error", error:error.message });
    }
}

export const toggleFeaturedProduct = async (req, res) => {
    try{
        const product=await Product.findById(req.params.id);
        if(product){
            product.isFeatured=!product.isFeatured;
            const updatedProduct=await product.save();
            await updateFeaturedProductsCache();
            res.json(updatedProduct);
        }
        else
        {
            return res.status(404).json({message:"Product not found"});
        }
    }
    catch(error)
    {
        console.log("error in toggle featured product controller", error.message);
        res.status(500).json({ message:"Server error", error:error.message });
    }
}

async function updateFeaturedProductsCache(){
    try{
        const featuredProducts=await Product.find({isFeatured:true}).lean();
        await redis.set("featuredProducts",JSON.stringify(featuredProducts));
    } catch (error) {
        console.log("error in update featured products cache", error.message);
    }
}