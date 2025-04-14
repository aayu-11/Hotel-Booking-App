import Room from "../models/Room.js";
import Hotel from "../models/hotel.js";
import mongoose from "mongoose";
import { updateHotelCheapestPrice } from "../utils/updateHotelPrice.js";

export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelId;
  const newRoom = new Room({
    ...req.body,
    hotel: hotelId, // Set the hotel reference
  });
  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
      // Update hotel's cheapestPrice after adding new room
      await updateHotelCheapestPrice(hotelId);
    } catch (err) {
      // If updating hotel fails, delete the room we just created
      await Room.findByIdAndDelete(savedRoom._id);
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    // Update hotel's cheapestPrice after room update
    await updateHotelCheapestPrice(updatedRoom.hotel);
    res.status(200).json(updatedRoom);
  } catch (error) {
    next(error);
  }
};

export const updatedRoomAvailability = async (req, res, next) => {
  try {
    const updatedRoom = await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates,
        },
      }
    );
    res.status(200).json("Room status has been updated.");
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (req, res, next) => {
  const { hotelId, roomId } = req.params;

  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Delete the room
    await Room.findByIdAndDelete(roomId, { session });

    // Remove the room ID from the hotel's rooms array
    await Hotel.findByIdAndUpdate(
      hotelId,
      { $pull: { rooms: roomId } },
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Update hotel's cheapestPrice after room deletion
    await updateHotelCheapestPrice(hotelId);

    res.status(200).json("Room deleted successfully");
  } catch (error) {
    // Abort the transaction in case of an error
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};
