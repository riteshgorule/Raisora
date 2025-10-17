import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, role: "user" });
        await newUser.save();
        res.status(201).json({ message: `User registered with username ${username}` });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ meassage: `User with username ${username} not found` });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: `Invalid credentials` });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" }
        );

        res.status(200).json({ token })

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export { register, login };

const me = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) return res.status(401).json({ ok: false, message: 'Not authenticated' });
        const user = await User.findById(userId).select('username role');
        if (!user) return res.status(404).json({ ok: false, message: 'User not found' });
        res.json({ ok: true, user: { id: user._id, username: user.username, role: user.role } });
    } catch (err) {
        console.error('me error', err);
        res.status(500).json({ ok: false, message: 'Failed to fetch user' });
    }
};

export { me };