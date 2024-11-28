import "./layout.scss";
import Navbar from "../../components/navbar/navbar";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import ConferenceLinks from "../../components/conferenceLinks/conferenceLinks";
function Layout() {
  return (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <ConferenceLinks />
        <Outlet />
      </div>
    </div>
  );
}

function RequireAuth() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return <Navigate to="/login" />;
  else {
    return (
      <div className="layout">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="content">
          <ConferenceLinks />
          <Outlet />
        </div>
      </div>
    );
  }
}

export { Layout, RequireAuth };
