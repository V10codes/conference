import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import "./homePage.scss";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import ConferenceLinks from "../../components/conferenceLinks/conferenceLinks";

const HomePage = () => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await apiRequest.get("/conferences");
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
      <ConferenceLinks currentUser={currentUser} />
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
                <td>
                  <Link
                    to={`conference/${conference.id}`}
                    className="conference-link"
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
      </section>
    </div>
  );
};

export default HomePage;
