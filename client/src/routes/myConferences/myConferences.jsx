import { useEffect, useState, useContext } from "react";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import "./myConferences.scss";

const MyConferences = () => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await apiRequest.get(
          `/registrations/user/${currentUser.id}`
        );
        console.log(response);
        setConferences(response.data); // Assuming response.data returns the array you shared
      } catch (err) {
        console.error("Failed to fetch conferences:", err);
        setError("Failed to load conferences. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser.id) {
      fetchConferences();
    }
  }, [currentUser.id]);

  if (loading) {
    return <p>Loading conferences...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="myConferences-container">
      <section className="myConferences-list">
        <h2>My Conferences</h2>
        <p>Below is a list of conferences you are registered for:</p>
        {conferences.length > 0 ? (
          <table className="myConferences-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date / Time</th>
                <th>Venue</th>
                <th>Approval Status</th>
                <th>View Papers</th>
                <th>Price (INR)</th>
              </tr>
            </thead>
            <tbody>
              {conferences.map((registration) => (
                <tr key={registration.id}>
                  <td>{registration.conference.title}</td>
                  <td>
                    {new Date(
                      registration.conference.startDate
                    ).toLocaleDateString()}{" "}
                    /{" "}
                    {new Date(
                      registration.conference.startDate
                    ).toLocaleTimeString()}{" "}
                    -{" "}
                    {new Date(
                      registration.conference.endDate
                    ).toLocaleTimeString()}
                  </td>
                  <td>{registration.conference.venue}</td>
                  <td
                    className={
                      registration.approved ? "approved" : "not-approved"
                    }
                  >
                    {registration.approved ? "Approved" : "Not Approved"}
                  </td>
                  <td>
                    <a
                      href={registration.registrationDetail.identityCardUrl}
                      target="_blank"
                      style={{
                        textDecoration: "none",
                        color: "blue",
                        padding: "5px",
                        transition: "background-color 0.3s, color 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#f0f0f0";
                        e.target.style.color = "darkblue";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.color = "blue";
                      }}
                    >
                      View Paper
                    </a>
                  </td>
                  <td>{registration.conference.price.toFixed(2)}</td>
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

export default MyConferences;
