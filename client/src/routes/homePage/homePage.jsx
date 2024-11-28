import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./homePage.scss";
import apiRequest from "../../lib/apiRequest";

const HomePage = () => {
  const [conferences, setConferences] = useState([]);
  const [filteredConferences, setFilteredConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await apiRequest.get("/conferences");
        setConferences(response.data);
        setFilteredConferences(response.data); // Set filtered list to all conferences initially
      } catch (err) {
        console.error("Failed to fetch conferences:", err);
        setError("Failed to load conferences. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchConferences();
  }, []);

  // Filter conferences based on the search term
  useEffect(() => {
    setFilteredConferences(
      conferences.filter((conference) =>
        conference.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, conferences]);

  if (loading) {
    return <p>Loading conferences...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="homepage-container">
      <section className="program-section">
        {/* Search bar */}
        <h2>All Conferences</h2>
        <p>Below are the details of all upcoming conferences:</p>
        <p>Click the links to register for them: </p>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
        </div>

        <table className="program-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date / Time</th>
              <th>Venue</th>
              <th>Program</th>
              <th>Price</th>
              <th>External URL</th>
            </tr>
          </thead>
          <tbody>
            {filteredConferences.map((conference) => (
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
                <td className="conference-link">
                  <Link to={conference.externalUrl} className="conference-link" target="blank">
                    {conference.externalUrl}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default HomePage;
