import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/navbar/Navbar";
import "./profile.css";
import axios from "axios";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("User object:", user);
        console.log("Access token:", user?.accessToken);

        const res = await axios.get(`/users/${user._id}`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });
        console.log("Response:", res.data);
        setUserData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error details:", err.response?.data || err.message);
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="profileContainer">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="profileContainer">
        <div className="profileWrapper">
          <h1 className="profileTitle">My Profile</h1>
          <div className="profileInfo">
            <div className="profileItem">
              <span className="profileLabel">Username:</span>
              <span className="profileValue">{userData?.username}</span>
            </div>
            <div className="profileItem">
              <span className="profileLabel">Email:</span>
              <span className="profileValue">{userData?.email}</span>
            </div>
            <div className="profileItem">
              <span className="profileLabel">Account Type:</span>
              <span className="profileValue">
                {userData?.isAdmin ? "Admin" : "User"}
              </span>
            </div>
            <div className="profileItem">
              <span className="profileLabel">Member Since:</span>
              <span className="profileValue">
                {new Date(userData?.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="profileSection">
            <h2 className="sectionTitle">My Reservations</h2>
            <div className="reservationsPlaceholder">
              <p>Your reservations will appear here</p>
              <p className="comingSoon">Coming Soon!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
