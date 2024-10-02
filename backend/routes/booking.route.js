import express, { Router } from 'express'
import { bookSlot, editSlot } from '../controllers/slot.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.post("/book",protectRoute, bookSlot);
router.post("/edit", protectRoute, editSlot);


export default router;