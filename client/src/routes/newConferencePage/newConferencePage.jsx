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
    <div className="newConferencePage">
      <div className="formContainer">
        <h1>Add New Conference</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" required />
            </div>
            <div className="item">
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
            <div className="item">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="item">
              <label htmlFor="venue">Venue</label>
              <input id="venue" name="venue" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="program">Program</label>
              <input id="program" name="program" type="text" />
            </div>
            <div className="item">
              <label htmlFor="startDate">Start Date</label>
              <input id="startDate" name="startDate" type="datetime-local" />
            </div>
            <div className="item">
              <label htmlFor="endDate">End Date</label>
              <input id="endDate" name="endDate" type="datetime-local" />
            </div>
            <div className="item">
              <label>Guest Speakers</label>
              {guestSpeakers.map((speaker, index) => (
                <div key={index} className="nestedItem">
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
            <div className="item">
              <label>Topics</label>
              {topics.map((topic, index) => (
                <div key={index} className="nestedItem">
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
            <button className="sendButton">Add Conference</button>
            {error && <span className="errorMessage">{error}</span>}{" "}
            {/* More user-friendly error display */}
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewConferencePage;
