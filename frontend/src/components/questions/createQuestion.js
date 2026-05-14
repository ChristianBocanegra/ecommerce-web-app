/* 
  File Name: createQuestion.js
  Description: This file defines a React component for creating a new question 
               related to an advertisement. The form collects user input including
               first name, last name, email, phone number, and the question itself. 
               Upon form submission, the question is sent to the API. The user can 
               also clear the form or go back to the previous page.
  Team's Name: BOFC 
  Group Number: 04
  Date: November 23, 2024
*/

import { useState } from "react"; // Importing React hook for managing state
import { useNavigate, useParams } from "react-router-dom"; // Importing React Router hooks for navigation and route params
import { createQuestion } from "../../datasource/API-question"; // Importing the API function to create a question

const CreateQuestion = () => {
    const { adID } = useParams(); // Retrieve Ad ID from the URL parameters using useParams
    const navigate = useNavigate(); // Hook for navigating between pages
    const [formData, setFormData] = useState({ // State to manage form data input
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        question: "",
    });

    // Function to handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value }); // Update the specific form field based on its name
    };

    // Function to clear the form data
    const handleClear = () => {
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            question: "",
        });
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        // Confirm with the user before submitting the question
        if (window.confirm("Are you sure you want to create this question?")) {
            try {
                await createQuestion(adID, formData); // Call the API to create a new question
                alert("Question created successfully!"); // Success message
                navigate(-1); // Navigate back to the previous page (list of questions)
            } catch (error) {
                alert("Error occurred. Please fill all required fields."); // Error message if creation fails
            }
        }
    };

    return (
        <div className="container" style={{ paddingTop: 5 }}>
            <h1>Create a Question</h1>
            <form onSubmit={handleSubmit}>
                {/* First Name input field */}
                <div className="form-group">
                    <label htmlFor="firstName">First Name:</label>
                    &nbsp;&nbsp;<input
                        type="text"
                        className="form-control"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required // Required field
                    />
                </div>

                {/* Last Name input field */}
                <div className="form-group">
                    <label htmlFor="lastName">Last Name:</label>
                    &nbsp;&nbsp;<input
                        type="text"
                        className="form-control"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required // Required field
                    />
                </div>

                {/* Email input field */}
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    &nbsp;&nbsp;<input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required // Required field
                    />
                </div>

                {/* Phone Number input field */}
                <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    &nbsp;&nbsp;<input
                        type="text"
                        className="form-control"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required // Required field
                    />
                </div>

                {/* Question input field */}
                <div className="form-group">
                    <label htmlFor="question">Question:</label>
                    &nbsp;&nbsp;<textarea
                        className="form-control"
                        id="question"
                        name="question"
                        value={formData.question}
                        onChange={handleChange}
                        required // Required field
                    ></textarea>
                </div>
                <br></br>

                {/* Submit button */}
                <button className="btn btn-primary" type="submit">
                    Submit
                </button>
                &nbsp;&nbsp;
                {/* Clear button */}
                <button className="btn btn-warning" type="button" onClick={handleClear}>
                    Clear
                </button>
                &nbsp;&nbsp;
                {/* Back button */}
                <button className="btn btn-secondary" type="button" onClick={() => navigate(-1)}>
                    Back
                </button>
            </form>
        </div>
    );
};

// Export the component
export default CreateQuestion; 
