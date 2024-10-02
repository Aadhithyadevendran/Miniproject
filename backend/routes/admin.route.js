import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createRoom, closeRoom, editRoom, openRoom } from "../controllers/room.contoller.js";

const router = express.Router();

router.post("/create",protectRoute, createRoom);
router.post("/close",protectRoute, closeRoom);
router.post("/edit",protectRoute, editRoom);
router.post("/open",protectRoute, openRoom);

export default router;