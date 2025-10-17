import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";

const router = express.Router();

//Only admin can access this rouute
router.get("/admin", verifyToken, authorizeRoles("admin"), (req,res) => {
    res.json({message: "Welcome Admin"});
});

//Both can access this route
router.get("/user", verifyToken,  authorizeRoles("admin", "user"), (req,res) => {
    res.json({message: "Welcome User"});
});

export default router;