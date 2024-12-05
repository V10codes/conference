import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./conferenceLinks.scss";

const ConferenceLinks = () => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);
  const getLinksForRole = (role) => {
    if (role === "author") {
      return [
        { href: "/authored-conferences", label: "Authored Conferences" },
        { href: "/add", label: "Add Conference" },
      ];
    } else if (role === "attendee") {
      return [{ href: "/my-conferences", label: "My Conferences" }];
    }
    return [];
  };

  const conferenceLinks = currentUser ? getLinksForRole(currentUser.role) : [];

  return (
    <div className="conference-links-container">
      {currentUser ? (
        conferenceLinks.map((link) => (
          <Link key={link.href} to={link.href}>
            <button className="conference-button">{link.label}</button>
          </Link>
        ))
      ) : (
        <p className="login-prompt">
          Please log in to view your conference links.
        </p>
      )}
    </div>
  );
};

export default ConferenceLinks;
