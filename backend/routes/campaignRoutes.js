import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { createCampaign, getCampaigns, getCampaign, updateCampaign, deleteCampaign, joinCampaign, leaveCampaign } from "../controllers/campaignController.js";

const router = express.Router();

// public: list & get
router.get('/', getCampaigns);
router.get('/:id', getCampaign);

// auth required to join
router.post('/:id/join', verifyToken, joinCampaign);
router.post('/:id/leave', verifyToken, leaveCampaign);

// admin only CRUD
router.post('/', verifyToken, authorizeRoles('admin'), createCampaign);
router.put('/:id', verifyToken, authorizeRoles('admin'), updateCampaign);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteCampaign);

export default router;
