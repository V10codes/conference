// ConferenceDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import "./conferenceDetail.scss"; // Optional: Create a separate SCSS file for styling

const ConferenceDetail = () => {
  const { id } = useParams(); // Get conference ID from URL parameters
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConferenceDetails = async () => {
      try {
        const response = await apiRequest.get(`/conferences/${id}`);
        setConference(response.data.conference);
      } catch (err) {
        console.error("Failed to fetch conference details:", err);
        setError("Failed to load conference details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    console.log(conference);
    fetchConferenceDetails();
  }, [id]);

  if (loading) {
    return <p>Loading conference details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="conference-detail-container">
      <h2>{conference.title}</h2>
      <p>
        <strong>Description:</strong> {conference.description}
      </p>
      <p>
        <strong>Venue:</strong> {conference.venue}
      </p>
      <p>
        <strong>Program:</strong> {conference.program}
      </p>
      <p>
        <strong>Date:</strong>{" "}
        {new Date(conference.startDate).toLocaleDateString()} -{" "}
        {new Date(conference.endDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Price:</strong> ₹{conference.price}
      </p>
      <p>
        <strong>Creation Date:</strong>{" "}
        {new Date(conference.creationDate).toLocaleDateString()}
      </p>
      <button className="register-button">
        <Link to={`/conference/register/${id}`}>Register</Link>
      </button>
    </div>
  );
};

export default ConferenceDetail;
