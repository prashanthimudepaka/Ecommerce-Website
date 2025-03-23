export const addToCart = async (req, res) => {
    try{
        const {productId}=req.body;
        const user=req.user;
        const existingItem=user.cart.find(item=>item.id==productId)
        if(existingItem)
        {
            existingItem.quantity++;
            
        }
        else
        {
            user.cartItems.push(productId);
        }
        await user.save();
        res.json({message:"Product added to cart"});
    }
    catch(error)
    {
        console.log("error in add to cart controller",error.message);
        res.status(500).json({message:"Server error",error:error.message});
    }   
};
export const removeAllFromCart = async (req, res) => {
    try{
        const {productId}=req.body;
        const user=req.user;
        if(!productId)
        {
            user.cartItems=[]; //remove all items from cart
        }
        else
        {
            user.cartItems=user.cartItems.filter(item=>item!=productId);
        }
        await user.save();
        res.json(user.cartItems);
    }
    catch(error)
    {
        console.log("error in remove all from cart controller",error.message);
        res.status(500).json({message:"Server error",error:error.message});
    }
}
export const updateQuantity = async (req, res) => {
    try{
        const {id:productId,quantity}=req.params;
        const user =req.user;
        const existingItem=user.cart.find(item=>item.id==productId);
        if(existingItem)
        {
           if(quantity===0)
           {
            user.cartItems=user.cartItems.filter(item=>item.id!==productId);
            await user.save();
            return res.json(user.cartItems);
           }
           existingItem.quantity=quantity;
           await user.save();
           return res.json(user.cartItems);
        }
        else
        {
            res.status(404).json({message:"Product not found in cart"});
        }

    }
    catch(error)
    {
        console.log("error in update quantity controller",error.message);
        res.status(500).json({message:"Server error",error:error.message});
    }

    }

export const getCartProducts = async (req, res) => {
    try{
       const products=await Product.find({id:{$in:req.user.cartItems}});
       //add quantity to each product
      const cartItems=products.map((product)=>{
       const item =req.user.cartItems.find((cartItem)=>cartItem.id==productId)       
       return {...product,quantity:item.quantity};
      })
      res.json(cartItems);
    }
    catch(error)
    {
        console.log("error in get cart products controller",error.message);
        res.status(500).json({message:"Server error",error:error.message});
    }
}
