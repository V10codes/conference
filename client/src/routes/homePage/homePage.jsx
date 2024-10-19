import React, { useEffect, useState } from "react";
import "./homePage.scss";
import apiRequest from "../../lib/apiRequest"; // Assuming you have a utility for API requests

const HomePage = () => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all conferences when the component mounts
  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await apiRequest.get("/conferences"); // Make sure your API endpoint is correct
        setConferences(response.data);
      } catch (err) {
        console.error("Failed to fetch conferences:", err);
        setError("Failed to load conferences. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchConferences();
  }, []);

  if (loading) {
    return <p>Loading conferences...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="homepage-container">
      <section className="program-section">
        <h2>All Conferences</h2>
        <p>Below are the details of all upcoming conferences:</p>

        <table className="program-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date / Time</th>
              <th>Venue</th>
              <th>Program</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {conferences.map((conference) => (
              <tr key={conference.id}>
                <td>{conference.title}</td>
                <td>
                  {new Date(conference.startDate).toLocaleDateString()} /{" "}
                  {new Date(conference.startDate).toLocaleTimeString()} -{" "}
                  {new Date(conference.endDate).toLocaleTimeString()}
                </td>
                <td>{conference.venue}</td>
                <td>{conference.program}</td>
                <td>${conference.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="schedule-section">
        <h3>View Presentation Schedule</h3>
        <form className="schedule-form">
          <label htmlFor="paperId">Paper ID/ Submission ID:</label>
          <input type="text" id="paperId" name="paperId" />
          <button className="schedule-btn">Show Schedule</button>
        </form>
      </section>
    </div>
  );
};

export default HomePage;
