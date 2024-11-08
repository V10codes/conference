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
        setAttendees(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendees();
  }, [id]);

  const toggleApproval = async (attendeeId, currentStatus) => {
    try {
      const updatedStatus = !currentStatus;
      await apiRequest.put(`/registrations/${attendeeId}/approve`, {
        approve: updatedStatus,
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
        <ul className="attendee-list">
          {attendees.map((attendee) => (
            <li key={attendee.id} className="attendee-item">
              {attendee.user ? (
                <div className="attendee-details">
                  <p className="attendee-info">
                    <strong>Name:</strong>{" "}
                    {attendee.registrationDetail.fullName}
                  </p>
                  <p className="attendee-info">
                    <strong>Email:</strong> {attendee.user.email}
                  </p>
                  <p className="attendee-info">
                    <strong>Gender:</strong>{" "}
                    {attendee.registrationDetail.gender}
                  </p>
                  <p className="attendee-info">
                    <strong>Participation Mode:</strong>{" "}
                    {attendee.registrationDetail.participationMode}
                  </p>
                  <p className="attendee-info">
                    <strong>Mobile Number:</strong>{" "}
                    {attendee.registrationDetail.mobileNumber}
                  </p>
                  <p className="attendee-info">
                    <strong>Transaction Date:</strong>{" "}
                    {new Date(
                      attendee.registrationDetail.transactionDate
                    ).toLocaleDateString()}
                  </p>
                  <p className="attendee-info">
                    <strong>Identity Card:</strong>{" "}
                    <a
                      href={`/${attendee.registrationDetail.identityCardUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="file-link"
                    >
                      View Identity Card
                    </a>
                  </p>
                  <p className="attendee-info">
                    <strong>Payment Proof:</strong>{" "}
                    <a
                      href={`/${attendee.registrationDetail.paymentProofUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="file-link"
                    >
                      View Payment Proof
                    </a>
                  </p>
                  <p className="attendee-info">
                    <strong>Approval Status:</strong>{" "}
                    {attendee.approved ? "Approved" : "Not Approved"}
                  </p>
                  <button
                    className={`approval-btn ${
                      attendee.approved ? "disapprove-btn" : "approve-btn"
                    }`}
                    onClick={() =>
                      toggleApproval(attendee.id, attendee.approved)
                    }
                  >
                    {attendee.approved ? "Disapprove" : "Approve"}
                  </button>
                </div>
              ) : (
                <p className="no-user-info">No user information available</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApproveAttendeePage;
