import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import { getProfile, updateProfile } from "../controllers/userController.js";

const router = express.Router();

// Authenticated user profile
router.get("/me", verifyToken, getProfile);
router.put("/me", verifyToken, updateProfile);

export default router;