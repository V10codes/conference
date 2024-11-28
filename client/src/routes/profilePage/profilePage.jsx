import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function ProfilePage() {
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-info">
        <h1>User Information</h1>
        <div className="user-details">
          <p>
            <strong>Username:</strong> {currentUser.username}
          </p>
          <p>
            <strong>E-mail:</strong> {currentUser.email}
          </p>
        </div>
        <div className="buttons">
          <Link to="/profile/update">
            <button className="update-btn">Update Profile</button>
          </Link>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
