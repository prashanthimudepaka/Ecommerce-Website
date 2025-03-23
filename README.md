# Ecommerce Website

A full-featured ecommerce website with user authentication, product management, and payment integration.
npm install and then run (all packages listed in packag.json will be installed) npm init -y for api part install below

npm i express dotenv mongoose jsonwebtoken stripe cloudinary cookie-parser bcrypt.js ioredis

npm install nodemon -D

in package.json : main:/backend/server.js dev:nodemon /backend/server.js //restarts this server file start:node backend/server.js

bcrypt is used to hashing password
run: npm run dev
## Setup Instructions

1. Clone the repository
   ```bash
   git clone <your-repository-url>
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create .env file in root directory with:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the server
   ```bash
   npm run dev    # for development
   npm start      # for production
   ```

## Features

- User Authentication (Login/Register)
- Product Management
- Shopping Cart
- Payment Integration (Stripe)
- Image Upload (Cloudinary)
- Order Management

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Stripe Payment
- Cloudinary
- Redis

## API Documentation

### Auth Routes
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### Product Routes
- GET /api/products - Get all products
- POST /api/products - Add new product
- GET /api/products/:id - Get single product
- PUT /api/products/:id - Update product
- DELETE /api/products/:id - Delete product

### Order Routes
- POST /api/orders - Create new order
- GET /api/orders - Get user orders

## Environment Variables

- PORT - Server port number
- MONGODB_URI - MongoDB connection string
- JWT_SECRET - Secret key for JWT
- STRIPE_SECRET_KEY - Stripe secret key
- CLOUDINARY_NAME - Cloudinary cloud name
- CLOUDINARY_API_KEY - Cloudinary API key
- CLOUDINARY_API_SECRET - Cloudinary API secret

//why folders?
Models = Store's inventory forms (what info we need for each product)
Routes = Store directory ("Electronics in Aisle 5")
Controllers = Store clerks (doing the actual work)
Middlewares = Security guards & helpers (checking IDs, helping with bags)

FLOW OF REQUESTS:
Client Request → server.js → Routes → Middleware → Controller → Response


external urls used:
https://account.mongodb.com/account/login?signedOut=true

https://console.upstash.com/redis/b0cbf443-f5f0-4547-992e-fb7b105fb5c4?tab=data-browser&teamid=0

https://console.cloudinary.com/settings/c-f2f7efd524dfdae09749e5cf2e6089/api-keys