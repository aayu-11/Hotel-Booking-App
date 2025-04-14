import Reservation from "../models/Reservation.js";
import { createError } from "../utils/error.js";

// Create a new reservation
export const createReservation = async (req, res, next) => {
  try {
    const newReservation = new Reservation({
      ...req.body,
      user: req.user.id, // Set the user ID from the authenticated user
    });

    const savedReservation = await newReservation.save();
    res.status(201).json(savedReservation);
  } catch (error) {
    next(error);
  }
};

// Get all reservations for a specific user
export const getUserReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ user: req.params.id })
      .populate("hotel", "name photos")
      .populate("room", "title price")
      .sort({ bookingDate: -1 }); // Sort by most recent first

    res.status(200).json(reservations);
  } catch (error) {
    next(error);
  }
};

// Get a specific reservation
export const getReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("hotel", "name photos address city")
      .populate("room", "title price maxPeople")
      .populate("user", "username email");

    if (!reservation) {
      return next(createError(404, "Reservation not found"));
    }

    res.status(200).json(reservation);
  } catch (error) {
    next(error);
  }
};

// Update reservation status
export const updateReservation = async (req, res, next) => {
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
      .populate("hotel", "name")
      .populate("room", "title");

    if (!updatedReservation) {
      return next(createError(404, "Reservation not found"));
    }

    res.status(200).json(updatedReservation);
  } catch (error) {
    next(error);
  }
};

// Cancel a reservation
export const cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return next(createError(404, "Reservation not found"));
    }

    // Check if reservation can be cancelled (e.g., not already cancelled or completed)
    if (reservation.status === "cancelled") {
      return next(createError(400, "Reservation is already cancelled"));
    }

    if (reservation.status === "completed") {
      return next(createError(400, "Cannot cancel a completed reservation"));
    }

    // Update the reservation status to cancelled
    const cancelledReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: "cancelled",
          paymentStatus: "refunded", // Assuming automatic refund on cancellation
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: "Reservation cancelled successfully",
      reservation: cancelledReservation,
    });
  } catch (error) {
    next(error);
  }
};
