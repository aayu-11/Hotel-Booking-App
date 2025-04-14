import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/navbar/Navbar";
import "./myReservations.css";
import axios from "axios";
import { format } from "date-fns";

const MyReservations = () => {
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  // Filter states
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await axios.get(`/reservations/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });
        setReservations(res.data);
        setFilteredReservations(res.data);
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

  useEffect(() => {
    let filtered = [...reservations];

    // Apply date filter
    if (dateFilter !== "all") {
      const today = new Date();
      filtered = filtered.filter((reservation) => {
        const checkInDate = new Date(reservation.checkInDate);
        if (dateFilter === "upcoming") {
          return checkInDate >= today;
        } else {
          return checkInDate < today;
        }
      });
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (reservation) => reservation.status === statusFilter
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (reservation) =>
          reservation.hotel.name.toLowerCase().includes(query) ||
          reservation.room.title.toLowerCase().includes(query)
      );
    }

    setFilteredReservations(filtered);
  }, [reservations, dateFilter, statusFilter, searchQuery]);

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

          {/* Filters and Search */}
          <div className="filtersContainer">
            <div className="searchBox">
              <input
                type="text"
                placeholder="Search by hotel or room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filterGroup">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Dates</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="resultsCount">
            {filteredReservations.length} reservation
            {filteredReservations.length !== 1 ? "s" : ""} found
          </div>

          {filteredReservations.length === 0 ? (
            <div className="noReservations">
              <p>No reservations found matching your criteria.</p>
            </div>
          ) : (
            <div className="reservationsList">
              {filteredReservations.map((reservation) => (
                <div className="reservationItem" key={reservation._id}>
                  <div className="reservationImage">
                    <img
                      src={reservation.hotel.photos[0]}
                      alt={reservation.hotel.name}
                    />
                  </div>
                  <div className="reservationDetails">
                    <div className="reservationHeader">
                      <h2>{reservation.hotel.name}</h2>
                      <span className={`statusBadge ${reservation.status}`}>
                        {reservation.status}
                      </span>
                    </div>
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
                    <p className="price">Total: ${reservation.totalPrice}</p>
                    <div className="reservationActions">
                      <button
                        className="cancelButton"
                        onClick={() => {
                          setSelectedReservation(reservation);
                          setShowCancelDialog(true);
                          setCancelError(null);
                        }}
                        disabled={
                          reservation.status === "cancelled" ||
                          reservation.status === "completed"
                        }
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
