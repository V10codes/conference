import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import "./authoredConferences.scss";

const AuthoredConferences = () => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await apiRequest.get("/conferences");
        // Filter conferences where currentUser.id matches the conference.authorId
        const userConferences = response.data.filter(
          (conference) => conference.authorId === currentUser.id
        );
        setConferences(userConferences);
      } catch (err) {
        console.error("Failed to fetch conferences:", err);
        setError("Failed to load conferences. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchConferences();
  }, [currentUser.id]);

  if (loading) {
    return <p>Loading conferences...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="AuthoredConferences-container">
      <section className="AuthoredConferences-list">
        <h2>Authored Conferences</h2>
        <p>Below is a list of conferences authored by you</p>
        <p>Click the links to approve/disapprove registrations</p>
        {conferences.length > 0 ? (
          <table className="AuthoredConferences-table">
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
                  <td className="attendee-links">
                    <Link
                      to={`/authored-conferences/attendee-list/${conference.id}`}
                    >
                      {conference.title}
                    </Link>
                  </td>
                  <td>
                    {new Date(conference.startDate).toLocaleDateString()} /{" "}
                    {new Date(conference.startDate).toLocaleTimeString()} -{" "}
                    {new Date(conference.endDate).toLocaleTimeString()}
                  </td>
                  <td>{conference.venue}</td>
                  <td>{conference.program}</td>
                  <td>{conference.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No conferences found for you.</p>
        )}
      </section>
    </div>
  );
};

export default AuthoredConferences;
