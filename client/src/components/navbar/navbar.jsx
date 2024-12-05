import { useContext } from "react";
import { Link } from "react-router-dom";
import "./navbar.scss";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext); // Retain currentUser functionality
  return (
    <nav className="wrapper">
      <div className="header">
        <h2>NIT Raipur - An IEEE Conference, India</h2>
        <h3>
          {currentUser
            ? `${
                currentUser.role.charAt(0).toUpperCase() +
                currentUser.role.slice(1)
              } Portal`
            : "Conference Portal"}
        </h3>
      </div>
      <div className="nav-items">
        <div className="navbar-left">
          <button>
            <Link to="/" className="navbar-link">
              Home
            </Link>
          </button>
        </div>
        <div className="navbar-right">
          {currentUser ? (
            <>
              <span>{currentUser.username}</span>
              <button>
                <Link to="/profile" className="navbar-link">
                  Profile
                </Link>
              </button>
            </>
          ) : (
            <>
              <button>
                <Link to="/login" className="navbar-link">
                  Sign in
                </Link>
              </button>
              <button>
                <Link to="/register" className="navbar-link">
                  Sign up
                </Link>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
