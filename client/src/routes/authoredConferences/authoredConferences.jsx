import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import "./authoredConferences.scss";

const AuthoredConferences = () => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await apiRequest.get("/conferences");
        const userConferences = response.data.filter(
          (conference) => conference.authorId === currentUser.id
        );

        const conferencesWithAttendees = await Promise.all(
          userConferences.map(async (conference) => {
            const attendeeResponse = await apiRequest.get(
              `/registrations/conference/${conference.id}`
            );
            return {
              ...conference,
              totalRegistrations: attendeeResponse.data.length,
            };
          })
        );

        setConferences(conferencesWithAttendees);
      } catch (err) {
        console.error("Failed to fetch conferences:", err);
        setError("Failed to load conferences. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchConferences();
  }, [currentUser.id]);

  const handleDelete = async (conferenceId) => {
    // Add a confirmation dialog before deletion
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this conference?"
    );
    if (!confirmDelete) {
      return; // If the user cancels, stop the deletion
    }

    try {
      await apiRequest.delete(`/conferences/${conferenceId}`);
      setConferences(
        conferences.filter((conference) => conference.id !== conferenceId)
      );
    } catch (err) {
      console.error("Failed to delete conference:", err);
      setError("Failed to delete the conference. Please try again later.");
    }
  };

  const handleUpdate = (conferenceId) => {
    // Navigate to the update page (assuming you have a route for updating conferences)
    navigate(`/authored-conferences/update/${conferenceId}`);
  };

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
        <p>Click the links to approve registrations</p>
        {conferences.length > 0 ? (
          <table className="AuthoredConferences-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Total Registrations</th>
                <th>Actions</th>
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
                  <td>{conference.totalRegistrations}</td>
                  <td className="conference-actions">
                    <button
                      className="update-btn"
                      onClick={() => handleUpdate(conference.id)}
                    >
                      Update
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(conference.id)}
                    >
                      Delete
                    </button>
                  </td>
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
