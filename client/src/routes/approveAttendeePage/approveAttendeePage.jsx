import { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import { useParams } from "react-router-dom";
import "./approveAttendeePage.scss";

const ApproveAttendeePage = () => {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const response = await apiRequest.get(
          `/registrations/conference/${id}`
        );
        console.log(response);
        setAttendees(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendees();
  }, [id]);

  const toggleApproval = async (attendeeId, currentStatus, attendeeEmail) => {
    try {
      const updatedStatus = !currentStatus;
      await apiRequest.put(`/registrations/${attendeeId}/approve`, {
        approve: updatedStatus,
        email: attendeeEmail,
      });

      setAttendees((prevAttendees) =>
        prevAttendees.map((attendee) =>
          attendee.id === attendeeId
            ? { ...attendee, approved: updatedStatus }
            : attendee
        )
      );
    } catch (err) {
      setError("Failed to update approval status.");
    }
  };

  if (loading) {
    return <div className="loading">Loading attendees...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="approve-attendee-container">
      <h1 className="heading">Attendees for the Conference</h1>
      {attendees.length === 0 ? (
        <p className="no-attendees">No attendees found for this conference.</p>
      ) : (
        <table className="attendee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Participation Mode</th>
              <th>Mobile Number</th>
              <th>Transaction Date</th>
              <th>Papers</th>
              <th>Payment Proof</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((attendee) => (
              <tr key={attendee.id}>
                {attendee.user ? (
                  <>
                    <td>{attendee.registrationDetail.fullName}</td>
                    <td>{attendee.registrationDetail.email}</td>
                    <td>{attendee.registrationDetail.gender}</td>
                    <td>{attendee.registrationDetail.participationMode}</td>
                    <td>{attendee.registrationDetail.mobileNumber}</td>
                    <td>
                      {new Date(
                        attendee.registrationDetail.transactionDate
                      ).toLocaleDateString()}
                    </td>
                    <td>
                      <a
                        href={`${attendee.registrationDetail.identityCardUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="file-link"
                      >
                        View Papers
                      </a>
                    </td>
                    <td>
                      <a
                        href={`${attendee.registrationDetail.paymentProofUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="file-link"
                      >
                        View Payment Proof
                      </a>
                    </td>
                    <td>
                      <button
                        className={`approval-btn ${
                          attendee.approved ? "disapprove-btn" : "approve-btn"
                        }`}
                        onClick={() =>
                          toggleApproval(
                            attendee.id,
                            attendee.approved,
                            attendee.registrationDetail.email
                          )
                        }
                      >
                        {attendee.approved ? "Disapprove" : "Approve"}
                      </button>
                    </td>
                  </>
                ) : (
                  <td colSpan="10" className="no-user-info">
                    No user information available
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApproveAttendeePage;
