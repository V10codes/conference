import { useState, useEffect, useContext } from "react";
import "./conferenceUpdatePage.scss";
import apiRequest from "../../lib/apiRequest";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function UpdateConferencePage() {
  const [conferenceData, setConferenceData] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [price, setPrice] = useState(0);
  const [upiId, setUpiId] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [branch, setBranch] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams(); // Get the conference ID from the URL params

  // Fetch existing conference data when the component mounts
  useEffect(() => {
    const fetchConferenceData = async () => {
      try {
        const res = await apiRequest.get(`/conferences/${id}`);
        const data = res.data.conference;
        setConferenceData(data);
        setDescription(data.description);
        setPrice(data.price);
        setUpiId(data.upiId || "");
        setBankName(data.bankName || "");
        setAccountName(data.accountName || "");
        setIfscCode(data.ifscCode || "");
        setBranch(data.branch || "");
      } catch (err) {
        console.error(err);
        setError("Failed to fetch conference data.");
      }
    };

    fetchConferenceData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    const formattedStartDate = new Date(inputs.startDate).toISOString();
    const formattedEndDate = new Date(inputs.endDate).toISOString();

    // Validate dates
    if (new Date(formattedStartDate) >= new Date(formattedEndDate)) {
      setError("End date must be later than start date.");
      return;
    }

    try {
      const res = await apiRequest.put(`/conferences/${id}`, {
        title: inputs.title,
        description: description,
        venue: inputs.venue,
        program: inputs.program,
        authorId: currentUser.id,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        price: parseFloat(price),
        upiId: inputs.upiId,
        bankName: inputs.bankName,
        accountName: inputs.accountName,
        ifscCode: inputs.ifscCode,
        branch: inputs.branch,
        externalUrl: inputs.externalUrl,
      });
      alert(res.data.message || "Conference updated successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to update conference. Please try again.");
    }
  };

  if (!conferenceData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="update-conference-page">
      <div className="form-container">
        <h1>Update Conference</h1>
        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            <div className="form-item">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                defaultValue={conferenceData.title}
                required
              />
            </div>
            <div className="form-item">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Enter conference description"
              />
            </div>
            <div className="form-item">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="form-item">
              <label htmlFor="venue">Venue</label>
              <input
                id="venue"
                name="venue"
                type="text"
                defaultValue={conferenceData.venue}
                required
              />
            </div>
            <div className="form-item">
              <label htmlFor="program">Program</label>
              <input
                id="program"
                name="program"
                type="text"
                defaultValue={conferenceData.program}
              />
            </div>
            <div className="form-item">
              <label htmlFor="startDate">Start Date</label>
              <input
                id="startDate"
                name="startDate"
                type="datetime-local"
                defaultValue={new Date(conferenceData.startDate)
                  .toISOString()
                  .slice(0, 16)}
              />
            </div>
            <div className="form-item">
              <label htmlFor="endDate">End Date</label>
              <input
                id="endDate"
                name="endDate"
                type="datetime-local"
                defaultValue={new Date(conferenceData.endDate)
                  .toISOString()
                  .slice(0, 16)}
              />
            </div>
            <div className="form-item">
              <label htmlFor="externalUrl">External URL</label>
              <input
                id="externalUrl"
                name="externalUrl"
                type="text"
                defaultValue={conferenceData.externalUrl || ""}
              />
            </div>

            {/* Payment Details Section */}
            <h2>Payment Details</h2>
            <div className="form-item">
              <label htmlFor="upiId">UPI ID</label>
              <input
                id="upiId"
                name="upiId"
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="Enter UPI ID"
              />
            </div>
            <div className="form-item">
              <label htmlFor="bankName">Bank Name</label>
              <input
                id="bankName"
                name="bankName"
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Enter bank name"
              />
            </div>
            <div className="form-item">
              <label htmlFor="accountName">Account Name</label>
              <input
                id="accountName"
                name="accountName"
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Enter account name"
              />
            </div>
            <div className="form-item">
              <label htmlFor="ifscCode">IFSC Code</label>
              <input
                id="ifscCode"
                name="ifscCode"
                type="text"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
                placeholder="Enter IFSC code"
              />
            </div>
            <div className="form-item">
              <label htmlFor="branch">Branch</label>
              <input
                id="branch"
                name="branch"
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="Enter branch"
              />
            </div>

            {/* Error and Submit Button */}
            {error && <div className="error">{error}</div>}
            <button type="submit">Update Conference</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateConferencePage;
