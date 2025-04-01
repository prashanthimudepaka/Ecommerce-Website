import express from 'express';
import User from '../models/user.model.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
	const { name, email, password } = req.body;

	try {
		const newUser = new User({ name, email, password });
		await newUser.save();
		res.status(201).json({ user: newUser });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

export default router; 