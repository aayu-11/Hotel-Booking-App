import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext.js";
import { AuthContext } from "../../context/AuthContext.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { da } from "date-fns/locale";

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);
  const { dates, options } = useContext(SearchContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const date = new Date(start.getTime());
    const dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const calculateTotalPrice = (price, startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    console.log("Price Calculation Details:");
    console.log("Start Date:", start);
    console.log("End Date:", end);
    console.log("Nights:", nights);
    console.log("Price per night:", price);
    console.log("Total Price:", price * nights);
    return price * nights;
  };

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates?.some((date) =>
      alldates.includes(new Date(date).getTime())
    );
    return !isFound;
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };
  console.log("data", data);

  const handleClick = async () => {
    try {
      console.log("Selected dates:", dates[0]);
      console.log("Room data:", data);

      // First, update room availability
      await Promise.all(
        selectedRooms.map((roomId) => {
          return axios.put(`/rooms/availability/${roomId}`, {
            dates: alldates,
          });
        })
      );

      // Then, create reservations for each selected room
      await Promise.all(
        selectedRooms.map((roomId) => {
          const room = data.find((r) =>
            r.roomNumbers.some((rn) => rn._id === roomId)
          );
          const roomNumber = room.roomNumbers.find((rn) => rn._id === roomId);
          const totalPrice = calculateTotalPrice(
            room.price,
            dates[0].startDate,
            dates[0].endDate
          );
          console.log("Creating reservation with total price:", totalPrice);

          return axios.post(
            "/reservations",
            {
              hotel: hotelId,
              room: room._id,
              roomNumber: roomNumber.number,
              checkInDate: new Date(dates[0].startDate),
              checkOutDate: new Date(dates[0].endDate),
              totalPrice: totalPrice,
              status: "confirmed",
              numberOfGuests: options.adult + options.children,
              paymentStatus: "paid",
            },
            {
              headers: {
                Authorization: `Bearer ${user.accessToken}`,
              },
            }
          );
        })
      );

      setOpen(false);
      navigate("/my-reservations");
    } catch (err) {
      console.error("Error creating reservation:", err);
      // You might want to show an error message to the user here
    }
  };
  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span>Select your rooms:</span>
        {data.map((item) => {
          const nights = Math.ceil(
            (new Date(dates[0].endDate) - new Date(dates[0].startDate)) /
              (1000 * 60 * 60 * 24)
          );
          const totalPrice = calculateTotalPrice(
            item.price,
            dates[0].startDate,
            dates[0].endDate
          );
          console.log("Displaying room:", item.title);
          console.log("Nights:", nights);
          console.log("Total Price:", totalPrice);

          return (
            <div className="rItem" key={item._id}>
              <div className="rItemInfo">
                <div className="rTitle">{item.title}</div>
                <div className="rDesc">{item.desc}</div>
                <div className="rMax">
                  Max people: <b>{item.maxPeople}</b>
                </div>
                <div className="rPrice">
                  ${item.price} per night
                  <br />
                  Total for {nights} nights: ${totalPrice}
                </div>
              </div>
              <div className="rSelectRooms">
                {item.roomNumbers.map((roomNumber, index) => (
                  <div className="room" key={index}>
                    <label>{roomNumber.number}</label>
                    <input
                      type="checkbox"
                      value={roomNumber._id}
                      onChange={handleSelect}
                      disabled={!isAvailable(roomNumber)}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <button onClick={handleClick} className="rButton">
          Reserve Now!
        </button>
      </div>
    </div>
  );
};

export default Reserve;
