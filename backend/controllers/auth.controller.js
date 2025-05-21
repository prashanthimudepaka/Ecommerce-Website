import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import redis from '../lib/redis.js';
// import toast from "react-hot-toast";

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
    const { email, password, name } = req.body;
    try {
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message: "User already exists"});
        }

        // Validate password
        if (!password || password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        }

        const user = await User.create({
            name,
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
export const refreshToken=async(req,res)=>{
    try{
        const refreshToken=req.cookies.refreshToken;
        if(!refreshToken)
        {
            return res.status(401).json({message:"Unauthorized"});
        }
        const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redis.get(`refreshToken:${decoded.userId}`);    
        if(!storedToken)
        {
            return res.status(401).json({message:"Unauthorized"});
        }
        const user=await User.findById(decoded.userId);
        
        if(!user)
        {
            return res.status(401).json({message:"Unauthorized"});
        }
        const accessToken=jwt.sign({userId:user._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"});
        res.cookie("accessToken",accessToken,
            {
                httpOnly:true,
                secure:process.env.NODE_ENV==="production",
                sameSite:"strict",
                maxAge:15*60*1000
            });
        res.json({message:"Token refreshed successfully"});
    }       
    catch(error) {
        console.log("error in refresh token controller");
        res.status(500).json({message:"server error",error:error.message});
    }
    
//accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2M4NDg3NjgwYTlkMjNlZDdlNTJhYWIiLCJpYXQiOjE3NDExNzk4MzksImV4cCI6MTc0MTE4MDczOX0.SPNnlLGu9S9yyNxLmhMvN1RBbDLFNn0WyrmAzoQvwdY; Path=/; HttpOnly; Expires=Wed, 05 Mar 2025 13:18:59 GMT;
//accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2M4NDg3NjgwYTlkMjNlZDdlNTJhYWIiLCJpYXQiOjE3NDExNzk5NjEsImV4cCI6MTc0MTE4MDg2MX0.0f_9iVvUMtZW5R07Ue9xKJsBUNktf6kVMjg27oIyVN4; Path=/; HttpOnly; Expires=Wed, 05 Mar 2025 13:21:01 GMT;
}
export const getProfile=async(req,res)=>{
    try{
        const user=req.user;
        res.json(user);
    }
    catch(error){
        res.status(500).json({message:"server error",error:error.message});
    }
}

//todo implement profile

/*I'll explain the auth.route.js file line by line, including the technical stack and concepts used:

```javascript:backend/routes/auth.route.js
// Line 1: Importing Express framework
import express from "express"
```
- Using ES6 module syntax (import/export)
- Express.js is a Node.js web application framework
- Provides routing, middleware support, and HTTP utility methods

```javascript:backend/routes/auth.route.js
// Line 2: Importing middleware
import { protectRoute } from "../middleware/auth.middleware.js"
```
- Custom middleware for authentication
- Likely uses JWT (JSON Web Tokens) or sessions for auth
- Relative path import using ES6 module syntax
- `.js` extension is required in ES modules

```javascript:backend/routes/auth.route.js
// Line 3: Importing controller functions
import { signup, login, logout, refreshToken, getProfile } from "../controllers/auth.controller.js"
```
- Using MVC (Model-View-Controller) pattern
- Controller functions handle business logic
- Destructuring import for multiple functions
- Separation of concerns: routes delegate to controllers

```javascript:backend/routes/auth.route.js
// Line 4: Creating router instance
const router = express.Router();
```
- Express.Router() creates modular, mountable route handlers
- Allows grouping related routes
- Can be mounted to different URL paths in main app

```javascript:backend/routes/auth.route.js
// Authentication routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
```
- RESTful API design pattern
- POST method used for creating/modifying resources
- Each route maps to a controller function
- Routes follow standard authentication flow:
  - Signup: User registration
  - Login: Authentication
  - Logout: Session termination
  - Refresh-token: JWT refresh mechanism

```javascript:backend/routes/auth.route.js
// Protected route with middleware
router.get("/profile", protectRoute, getProfile);
```
- GET method for retrieving data
- Middleware pattern: `protectRoute` runs before `getProfile`
- Route protection using authentication check
- Demonstrates Express middleware chaining

```javascript:backend/routes/auth.route.js
// Exporting router
export default router;
```
- ES6 default export
- Makes router available for mounting in main app

**Technical Stack Overview**:
1. **Node.js**
   - JavaScript runtime
   - Server-side platform

2. **Express.js**
   - Web framework for Node.js
   - Handles routing and middleware
   - RESTful API support

3. **Authentication**
   - Likely uses JWT or sessions
   - Implements refresh token mechanism
   - Protected routes

4. **Architecture Patterns**
   - MVC (Model-View-Controller)
   - Middleware pattern
   - Router-level middleware
   - RESTful API design

5. **Modern JavaScript**
   - ES6+ features
   - Module system
   - Async/await (likely in controllers)

6. **Security Considerations**
   - Protected routes
   - Authentication middleware
   - POST for sensitive data
   - Token refresh mechanism

This file would typically be used in a full-stack application, mounted in the main Express app like:
```javascript
// In app.js or server.js
import authRouter from './routes/auth.route.js';
app.use('/api/auth', authRouter);
```

The complete authentication flow would involve:
- Frontend (React/Vue/Angular)
- API Routes (This file)
- Controllers (auth.controller.js)
- Database (MongoDB/PostgreSQL)
- Authentication Middleware
- Token Management

This setup follows modern best practices for building secure, scalable authentication systems in Node.js applications.
 */