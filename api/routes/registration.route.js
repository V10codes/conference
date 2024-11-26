import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../middleware/multerConfig.js";
import {
  registerUser,
  getUserRegistrations,
  getConferenceRegistrations,
  approveRegistration,
  deleteRegistration,
} from "../controllers/registration.controller.js";

const router = express.Router();

router.post("/", verifyToken, upload, registerUser);

router.get("/user/:userId", verifyToken, getUserRegistrations);

router.get(
  "/conference/:conferenceId",
  verifyToken,
  getConferenceRegistrations
);

router.put("/:id/approve", verifyToken, approveRegistration);

router.delete("/:id", verifyToken, deleteRegistration);

export default router;
