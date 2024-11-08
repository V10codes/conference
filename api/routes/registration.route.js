import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../middleware/multerConfig.js";
import {
  registerUser, // Register user for a conference
  getUserRegistrations, // Get all registrations for a user
  getConferenceRegistrations, // Get all registrations for a conference
  approveRegistration, // Approve or reject a registration
  deleteRegistration, // Optional: Delete a registration
} from "../controllers/registration.controller.js";

const router = express.Router();

router.post("/", verifyToken, upload, registerUser);

// Get all registrations for a specific user
router.get("/user/:userId", verifyToken, getUserRegistrations);

// Get all users registered for a specific conference
router.get(
  "/conference/:conferenceId",
  verifyToken,
  getConferenceRegistrations
);

// Approve or reject a registration
router.put("/:id/approve", verifyToken, approveRegistration);

// Delete a registration by ID
router.delete("/:id", verifyToken, deleteRegistration);

export default router;
