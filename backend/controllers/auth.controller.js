import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import redis from '../lib/redis.js';

const generateTokens=(userId)=>{
    const accessToken = jwt.sign({userId},process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"15m"
    });
    const refreshToken = jwt.sign({userId},process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:"7d",
        }
    )

    return {accessToken,refreshToken};
};

const storeRefreshToken = async (userId, refreshToken) => {
    try {
        console.log('Attempting to store refresh token for user:', userId);
        
        // Test Redis connection first
        const pingResult = await redis.ping();
        console.log('Redis ping result:', pingResult);
        
        const key = `refreshToken:${userId}`;
        console.log('Using Redis key:', key);
        
        const result = await redis.set(
            key,
            refreshToken,
            'EX',
            7 * 24 * 60 * 60
        );
        
        console.log('Redis store result:', result);
        
        // Verify the token was stored
        const storedToken = await redis.get(key);
        console.log('Verified stored token exists:', !!storedToken);
        
        if (result !== 'OK') {
            throw new Error('Failed to store refresh token');
        }
        
        console.log('Refresh token successfully stored in Redis for user:', userId);
        return true;
    } catch (error) {
        console.error('Redis store error:', error);
        console.error('Error stack:', error.stack);
        // Continue without Redis if it fails
        console.log('Continuing without Redis storage');
        return false;
    }
};

const setCookies=(res,accessToken,refreshToken)=>{
    res.cookie("accessToken",accessToken, { //key name:accesToken
        httpOnly: true,//prevent xss attacks, prevent client side js to access cookie(cross site scripting attack)
        secure: process.env.NODE_ENV==="production",//prevent client side js to access cookie
        sameSite: "strict",//prevent client side js to access cookie (prevents cross-site request forgery)
    
        maxAge: 15*60*1000,//15minns
    });
    res.cookie("refreshToken",refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7*24*60*60*1000//7days
    });
}
export const signup = async (req, res) => {
    const { email, password, username } = req.body;
    try {
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message: "User already exists"});
        }

        const user = await User.create({
            username,
            email,
            password,
            role: "customer"
        });

        const {accessToken, refreshToken} = generateTokens(user._id);
        
        try {
            await storeRefreshToken(user._id, refreshToken);
        } catch (redisError) {
            console.error('Redis error:', redisError);
            // Continue without Redis if it fails
        }
        
        setCookies(res, accessToken, refreshToken);
        
        res.status(201).json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            message: "User created successfully"
        });
        
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({message: error.message});
    }
};

export const login = async (req, res) => {
   try{
    console.log("here runs the login")
       const {email,password} = req.body;
       const user = await User.findOne({email});
       console.log("here runs the login")
       if(user && (await user.comparePassword(password))){

           const {accessToken,refreshToken} = generateTokens(user._id);
           await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);
           res.json({
                
                   _id: user._id,
                   username: user.username,
                   email: user.email,
                   role: user.role,
              
               });  
       }
       else
       {
           res.status(401).json({message:"Invalid credentials"});
       }
       
    } catch (error) {                      
        console.error("error in login controller");
        res.status(500).json({message: error.message});
   }
};

export const logout = async (req, res) => {
    try{
        const  refreshToken = req.cookies.refreshToken; //user will send automatically to refresh token
        if(refreshToken)
        {
            const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refreshToken:${decoded.userId}`);

        }
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({message:"Logout successful"});
    }
    catch(error)
    {
        res.status(500).json({message:"sever error",error:error.message});
    }
};