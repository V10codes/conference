import { useState, useContext } from "react";
import "./newConferencePage.scss";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function NewConferencePage() {
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [price, setPrice] = useState(0);
  const [guestSpeakers, setGuestSpeakers] = useState([]);
  const [topics, setTopics] = useState([]);
  const [upiId, setUpiId] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [branch, setBranch] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const handleAddGuestSpeaker = () => {
    setGuestSpeakers([...guestSpeakers, ""]);
  };

  const handleGuestSpeakerChange = (index, value) => {
    const updatedSpeakers = [...guestSpeakers];
    updatedSpeakers[index] = value;
    setGuestSpeakers(updatedSpeakers);
  };

  const handleRemoveGuestSpeaker = (index) => {
    const updatedSpeakers = guestSpeakers.filter((_, i) => i !== index);
    setGuestSpeakers(updatedSpeakers);
  };

  const handleAddTopic = () => {
    setTopics([...topics, ""]);
  };

  const handleTopicChange = (index, value) => {
    const updatedTopics = [...topics];
    updatedTopics[index] = value;
    setTopics(updatedTopics);
  };

  const handleRemoveTopic = (index) => {
    const updatedTopics = topics.filter((_, i) => i !== index);
    setTopics(updatedTopics);
  };

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
      const res = await apiRequest.post("/conferences", {
        conferenceData: {
          title: inputs.title,
          description: description,
          venue: inputs.venue,
          program: inputs.program,
          authorId: currentUser.id,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          price: parseFloat(price),
          guestSpeakers: guestSpeakers,
          topics: topics,
          upiId: inputs.upiId,
          bankName: inputs.bankName,
          accountName: inputs.accountName,
          ifscCode: inputs.ifscCode,
          branch: inputs.branch,
          externalUrl: inputs.externalUrl,
        },
      });
      alert(res.data.message || "Conference created successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to create conference. Please try again.");
    }
  };

  return (
    <div className="new-conference-page">
      <div className="form-container">
        <h1>Add New Conference</h1>
        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            <div className="form-item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" required />
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
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="form-item">
              <label htmlFor="venue">Venue</label>
              <input id="venue" name="venue" type="text" required />
            </div>
            <div className="form-item">
              <label htmlFor="program">Program</label>
              <input id="program" name="program" type="text" />
            </div>
            <div className="form-item">
              <label htmlFor="startDate">Start Date</label>
              <input id="startDate" name="startDate" type="datetime-local" />
            </div>
            <div className="form-item">
              <label htmlFor="endDate">End Date</label>
              <input id="endDate" name="endDate" type="datetime-local" />
            </div>
            <div className="form-item">
              <label htmlFor="externalUrl">External URL </label>
              <input id="externalUrl" name="externalUrl" type="text" />
            </div>
            <div className="guest-speakers">
              <label>Guest Speakers</label>
              {guestSpeakers.map((speaker, index) => (
                <div key={index} className="nested-item">
                  <input
                    type="text"
                    value={speaker}
                    onChange={(e) =>
                      handleGuestSpeakerChange(index, e.target.value)
                    }
                    placeholder="Enter guest speaker"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveGuestSpeaker(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={handleAddGuestSpeaker}>
                Add Guest Speaker
              </button>
            </div>
            <div className="topics">
              <label>Topics</label>
              {topics.map((topic, index) => (
                <div key={index} className="nested-item">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => handleTopicChange(index, e.target.value)}
                    placeholder="Enter topic"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTopic(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={handleAddTopic}>
                Add Topic
              </button>
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

            <button className="submit-button">Add Conference</button>
            {error && <span className="error-message">{error}</span>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewConferencePage;
