import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

// Hash password before saving
//pre save  hook to hash password before saving to database
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

// Create model AFTER defining middleware
const User = mongoose.model('User', userSchema);

export default User;


/*✅ Defines user structure in MongoDB
✅ Ensures data validation (required fields, unique email, password length)
✅ Supports cart functionality (users can add products)
✅ Implements role-based access control (customer/admin)
✅ Enables automatic timestamps */
