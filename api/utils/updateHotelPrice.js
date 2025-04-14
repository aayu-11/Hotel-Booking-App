import Room from "../models/Room.js";
import Hotel from "../models/hotel.js";

export const updateHotelCheapestPrice = async (hotelId) => {
  try {
    // Find all rooms for this hotel
    const rooms = await Room.find({ hotel: hotelId });
    console.log(`Found ${rooms.length} rooms for hotel ${hotelId}`);

    if (rooms.length === 0) {
      console.log(`No rooms found for hotel ${hotelId}, setting default price`);
      await Hotel.findByIdAndUpdate(hotelId, { cheapestPrice: 9999 });
      return;
    }

    // Find the lowest price among all rooms
    const prices = rooms.map((room) => room.price);
    console.log(`Room prices: ${prices.join(", ")}`);
    const lowestPrice = Math.min(...prices);
    console.log(
      `Setting cheapest price to ${lowestPrice} for hotel ${hotelId}`
    );

    // Update the hotel's cheapestPrice
    await Hotel.findByIdAndUpdate(hotelId, { cheapestPrice: lowestPrice });
  } catch (error) {
    console.error("Error updating hotel's cheapest price:", error);
    throw error; // Re-throw the error to handle it in the controller
  }
};
