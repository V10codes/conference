import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import "./conferenceDetail.scss"; 

const ConferenceDetail = () => {
  const { id } = useParams(); // Get conference ID from URL parameters
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConferenceDetails = async () => {
      try {
        const response = await apiRequest.get(`/conferences/${id}`);
        console.log(response.data);
        setConference(response.data.conference);
      } catch (err) {
        console.error("Failed to fetch conference details:", err);
        setError("Failed to load conference details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
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
        <strong>Description:</strong>{" "}
        {conference.description || "No description provided"}
      </p>
      <p>
        <strong>Venue:</strong> {conference.venue || "No venue specified"}
      </p>
      <p>
        <strong>Program:</strong>{" "}
        {conference.program || "No program details available"}
      </p>
      <p>
        <strong>Date:</strong>{" "}
        {new Date(conference.startDate).toLocaleDateString()} -{" "}
        {new Date(conference.endDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Price:</strong> ₹{conference.price || "Not available"}
      </p>
      <p>
        <strong>Creation Date:</strong>{" "}
        {new Date(conference.creationDate).toLocaleDateString()}
      </p>
      <div>
        <strong>Guest Speakers:</strong>
        {conference.guestSpeakers && conference.guestSpeakers.length > 0 ? (
          <ul>
            {conference.guestSpeakers.map((speaker, index) => (
              <li key={index}>{speaker}</li>
            ))}
          </ul>
        ) : (
          <p>No guest speakers listed</p>
        )}
      </div>
      <div>
        <strong>Topics:</strong>
        {conference.topics && conference.topics.length > 0 ? (
          <ul>
            {conference.topics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        ) : (
          <p>No topics listed</p>
        )}
      </div>
      <div>
        <strong>Payment Details:</strong>
        <p>
          <strong>UPI Id:</strong> {conference.upiId || "Not provided"}
        </p>
        <p>
          <strong>Bank Name:</strong> {conference.bankName || "Not provided"}
        </p>
        <p>
          <strong>Account Name:</strong>{" "}
          {conference.accountName || "Not provided"}
        </p>
        <p>
          <strong>IFSC Code:</strong> {conference.ifscCode || "Not provided"}
        </p>
        <p>
          <strong>Branch:</strong> {conference.branch || "Not provided"}
        </p>
      </div>
      <button className="register-button">
        <Link to={`/conference/register/${id}`}>Register</Link>
      </button>
    </div>
  );
};

export default ConferenceDetail;
