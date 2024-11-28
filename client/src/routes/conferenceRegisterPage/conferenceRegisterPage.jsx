import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./conferenceRegisterPage.scss";
import apiRequest from "../../lib/apiRequest";

const ConferenceRegisterPage = () => {
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    gender: "",
    participationMode: "",
    mobileNumber: "",
    identityCard: null,
    transactionDate: "",
    paymentProof: null,
  });

  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Validate file types and sizes
    if (name === "identityCard" || name === "paymentProof") {
      const file = files[0];
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      const maxSize = 5 * 1024 * 1024; // 5 MB limit

      if (file) {
        if (!allowedTypes.includes(file.type)) {
          alert("Only JPG, PNG or PDF files are allowed.");
          return;
        }
        if (file.size > maxSize) {
          alert("File size should not exceed 5MB.");
          return;
        }
      }
      setFormData((prevState) => ({ ...prevState, [name]: file }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const userId = currentUser.id;
    const conferenceId = id;

    const registrationFormData = new FormData();

    registrationFormData.append("userId", userId);
    registrationFormData.append("conferenceId", conferenceId);
    registrationFormData.append("registrationDetail[email]", formData.email);
    registrationFormData.append(
      "registrationDetail[fullName]",
      formData.fullName
    );
    registrationFormData.append("registrationDetail[gender]", formData.gender);
    registrationFormData.append(
      "registrationDetail[participationMode]",
      formData.participationMode
    );
    registrationFormData.append(
      "registrationDetail[mobileNumber]",
      formData.mobileNumber
    );
    registrationFormData.append(
      "registrationDetail[transactionDate]",
      formData.transactionDate
    );

    if (formData.identityCard) {
      registrationFormData.append("identityCard", formData.identityCard);
    }
    if (formData.paymentProof) {
      registrationFormData.append("paymentProof", formData.paymentProof);
    }

    try {
      // Send registration data to the backend
      const response = await apiRequest.post(
        "/registrations",
        registrationFormData
      );

      console.log("Registration successful:", response.data);
      alert("Registration successful!");
      navigate("/");
    } catch (error) {
      console.error("Error registering for conference:", error);
      const errorMessage =
        error.response?.data?.error || "An error occurred while registering.";
      alert(errorMessage);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="conference-register-page">
      <h2>Register for Conference</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-item">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-item">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-item">
          <label>Participation Mode</label>
          <select
            name="participationMode"
            value={formData.participationMode}
            onChange={handleChange}
            required
          >
            <option value="">Select Mode</option>
            <option value="online">Online</option>
            <option value="in-person">In-Person</option>
          </select>
        </div>

        <div className="form-item">
          <label>Mobile Number</label>
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <label>Upload Papers</label>
          <input
            type="file"
            name="identityCard"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <label>Transaction Date</label>
          <input
            type="date"
            name="transactionDate"
            value={formData.transactionDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <label>Attach Proof of Payment</label>
          <input
            type="file"
            name="paymentProof"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Submitting..." : "Submit Registration"}
        </button>
      </form>
    </div>
  );
};

export default ConferenceRegisterPage;
