import User from "../models/user.model.js";

export const signup = async (req, res) => {
    const { email, password, username } = req.body;
    try {
        const user = await User.create({
            username,
            email,
            password,
            role: "customer"
        });
        res.status(201).json({
            message: "User created successfully",
            user
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const login = async (req, res) => {
    res.send("login route called");
};

export const logout = async (req, res) => {
    res.send("logout route called");
};