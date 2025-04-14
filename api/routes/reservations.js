import express from "express";
import {
  createReservation,
  getUserReservations,
  getReservation,
  updateReservation,
  cancelReservation,
} from "../controllers/reservation.js";
import { verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// Create a new reservation
router.post("/", verifyToken, createReservation);

// Get all reservations for a specific user
router.get("/user/:id", verifyUser, getUserReservations);

// Get a specific reservation
router.get("/:id", verifyToken, getReservation);

// Update reservation status
router.put("/:id", verifyToken, updateReservation);

// Cancel a reservation
router.delete("/:id", verifyToken, cancelReservation);

export default router;
