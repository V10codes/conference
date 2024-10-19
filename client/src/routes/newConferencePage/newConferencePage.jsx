import { useState, useContext } from "react";
import "./newConferencePage.scss"; // Updated the stylesheet
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest"; // Ensure this is set up for your API
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Assuming you have an AuthContext that provides the user

function NewConferencePage() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [price, setPrice] = useState(0); // Initialize price state
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Retrieve the current user data

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/conferences", {
        conferenceData: {
          title: inputs.title,
          description: value,
          venue: inputs.venue,
          researchArea: inputs.researchArea,
          authorId: user.id, // Use the logged-in user's ID
          startDate: inputs.startDate,
          endDate: inputs.endDate,
          price: parseFloat(price), // Convert price to float
        },
        attendees: [], // Initialize attendees as an empty array or handle as needed
      });
      navigate("/conferences/" + res.data.id); // Redirect to the new conference page
    } catch (err) {
      console.log(err);
      setError("Failed to create conference. Please try again."); // Set a more user-friendly error message
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
              <label htmlFor="researchArea">Research Area</label>
              <input
                id="researchArea"
                name="researchArea"
                type="text"
                required
              />
            </div>
            <div className="item">
              <label htmlFor="startDate">Start Date</label>
              <input
                id="startDate"
                name="startDate"
                type="datetime-local"
                required
              />
            </div>
            <div className="item">
              <label htmlFor="endDate">End Date</label>
              <input
                id="endDate"
                name="endDate"
                type="datetime-local"
                required
              />
            </div>
            <button className="sendButton">Add Conference</button>
            {error && <span>{error}</span>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewConferencePage;
