import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/navbar/Navbar";
import "./myReservations.css";
import axios from "axios";
import { format } from "date-fns";

const MyReservations = () => {
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await axios.get(`/reservations/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });
        setReservations(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch reservations");
        setLoading(false);
      }
    };

    if (user) {
      fetchReservations();
    }
  }, [user]);

  const handleCancelReservation = async () => {
    try {
      await axios.delete(`/reservations/${selectedReservation._id}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      setReservations(
        reservations.filter((r) => r._id !== selectedReservation._id)
      );
      setShowCancelDialog(false);
      setCancelError(null);
    } catch (err) {
      setCancelError(
        err.response?.data?.message || "Failed to cancel reservation"
      );
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="reservationsContainer">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="reservationsContainer">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="reservationsContainer">
        <div className="reservationsWrapper">
          <h1 className="reservationsTitle">My Reservations</h1>

          {reservations.length === 0 ? (
            <div className="noReservations">
              <p>You don't have any reservations yet.</p>
            </div>
          ) : (
            <div className="reservationsList">
              {reservations.map((reservation) => (
                <div className="reservationItem" key={reservation._id}>
                  <div className="reservationImage">
                    <img
                      src={reservation.hotel.photos[0]}
                      alt={reservation.hotel.name}
                    />
                  </div>
                  <div className="reservationDetails">
                    <h2>{reservation.hotel.name}</h2>
                    <p className="roomType">{reservation.room.title}</p>
                    <div className="dateInfo">
                      <p>
                        <span>Check-in:</span>{" "}
                        {format(
                          new Date(reservation.checkInDate),
                          "MMM dd, yyyy"
                        )}
                      </p>
                      <p>
                        <span>Check-out:</span>{" "}
                        {format(
                          new Date(reservation.checkOutDate),
                          "MMM dd, yyyy"
                        )}
                      </p>
                    </div>
                    <p className="price">Total: ${reservation.totalAmount}</p>
                    <div className="status">
                      <span className={`statusBadge ${reservation.status}`}>
                        {reservation.status}
                      </span>
                    </div>
                    <div className="reservationActions">
                      <button
                        className="cancelButton"
                        onClick={() => {
                          setSelectedReservation(reservation);
                          setShowCancelDialog(true);
                          setCancelError(null);
                        }}
                        disabled={reservation.status === "cancelled"}
                      >
                        Cancel Reservation
                      </button>
                      <button className="contactButton">Contact Support</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCancelDialog && (
        <div className="cancelDialog">
          <div className="dialogContent">
            <h3>Cancel Reservation</h3>
            <p>
              Are you sure you want to cancel this reservation? This action
              cannot be undone.
            </p>
            {cancelError && <p className="dialogError">{cancelError}</p>}
            <div className="dialogActions">
              <button
                className="dialogButton"
                onClick={() => {
                  setShowCancelDialog(false);
                  setCancelError(null);
                }}
              >
                No, Keep It
              </button>
              <button
                className="dialogButton cancel"
                onClick={handleCancelReservation}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReservations;
