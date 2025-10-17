import express from 'express';
import verifyToken from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/roleMiddleware.js';
import { listEvents, getEvent, createEvent, updateEvent, deleteEvent, registerEvent, unregisterEvent } from '../controllers/eventController.js';

const router = express.Router();

router.get('/', listEvents);
router.get('/:id', getEvent);

router.post('/:id/register', verifyToken, registerEvent);
router.post('/:id/unregister', verifyToken, unregisterEvent);

router.post('/', verifyToken, authorizeRoles('admin'), createEvent);
router.put('/:id', verifyToken, authorizeRoles('admin'), updateEvent);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteEvent);

export default router;
