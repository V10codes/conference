import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getConferences,
  getConference,
  addConference,
  updateConference,
  deleteConference,
} from "../controllers/conference.controller.js";

const router = express.Router();

router.get("/", getConferences);
router.get("/:id", getConference);
router.post("/", verifyToken, addConference);
router.put("/:id", verifyToken, updateConference);
router.delete("/:id", verifyToken, deleteConference);

export default router;
