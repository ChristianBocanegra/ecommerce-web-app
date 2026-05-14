/* 
  File Name: specificQuestion.js
  Description: This component is responsible for displaying the details of a specific question, 
               allowing authenticated users to submit an answer. It retrieves the question data 
               based on the `questionID` from the URL and displays the question along with its 
               existing answer, if any. If the question has not been answered, the component 
               provides a text area for users to input their answer. The component also manages 
               the submission process, including displaying a confirmation prompt before submitting
               and showing loading states during the process. If the user is not authenticated, 
               a prompt to sign in is shown. The component ensures that the answer submission is 
               only possible if the user is authenticated and the question hasn't already been 
               answered. 
  Team's name: BOFC 
  Group number: 04
  Date: November 23, 2024
*/

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSpecificQuestion, answerQuestion } from "../../datasource/API-question";
import { getToken } from "../../components/auth/auth-helper"; 

const SpecificQuestion = () => {
    const { questionID } = useParams(); // Retrieve question ID from the URL
    const navigate = useNavigate(); // Use navigate for redirects
    const [question, setQuestion] = useState(null); // Store the question details
    const [answer, setAnswer] = useState(""); // Store the user's answer
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Check if the user is authenticated
    const [isSubmitting, setIsSubmitting] = useState(false); // Track the submitting state
    console.log(questionID);
    
    // Fetch the question details when the component loads
    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const data = await getSpecificQuestion(questionID);
                setQuestion(data);
            } catch (error) {
                alert("Failed to load the question details.");
            }
        };
        fetchQuestion();

        // Check if the user is authenticated
        const token = getToken();
        setIsAuthenticated(!!token); // User is authenticated if a token is found
    }, [questionID]);

    // Handle answer submission
    const handleAnswerSubmit = async () => {
        if (!answer.trim()) {
            alert("Please provide an answer.");
            return;
        }

        if (window.confirm("Are you sure you want to submit this answer?")) {
            setIsSubmitting(true); // Set submitting state to true
            try {
                // Update the question with the answer in the backend
                await answerQuestion(questionID, { answer });
                alert("Answer submitted successfully!");

                // Update the local state with the new answer
                const updatedQuestion = { ...question, answer };
                setQuestion(updatedQuestion);

                // Navigate back to the questions list
                navigate(-1); // Go back to the previous page
            } catch (error) {
                alert("Failed to submit the answer. Please try again.");
            } finally {
                setIsSubmitting(false); // Reset submitting state after submission
            }
        }
    };

    // Handle clearing the answer input
    const handleClear = () => {
        setAnswer(""); // Reset the answer field
    };

    // If no question is loaded, show loading message
    if (!question) {
        return <div>Loading question details...</div>;
    }

    // Disable the Submit Answer button if the question already has an answer
    const isAnswered = question.answer && question.answer.trim() !== "";

    return (
        <div className="container mt-5">
            <h1>Question Details</h1>
            <p><strong>Question:</strong> {question.question}</p>
            
            {isAnswered ? (
                <p><strong>Answer:</strong> {question.answer}</p>
            ) : (
                <div>
                    {!isAuthenticated ? (
                        <p>Please <a href="/signin">sign in</a> to answer this question.</p>
                    ) : (
                        <textarea
                            className="form-control mb-3"
                            placeholder="Enter your answer here..."
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                        />
                    )}
                    <br></br>
                    <br></br>
                    
                    <button
                        className="btn btn-primary me-2"
                        onClick={handleAnswerSubmit}
                        disabled={isAnswered || !isAuthenticated || isSubmitting} 
                    >
                        Submit Answer
                    </button>
                    &nbsp;&nbsp;
                    <button
                        className="btn btn-warning me-2"
                        onClick={handleClear}
                        disabled={!isAuthenticated} 
                    >
                        Clear
                    </button>
                    &nbsp;&nbsp;
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate(-1)} 
                    >
                        Back
                    </button>
                </div>
            )}
        </div>
    );
};

// Export the component
export default SpecificQuestion;
