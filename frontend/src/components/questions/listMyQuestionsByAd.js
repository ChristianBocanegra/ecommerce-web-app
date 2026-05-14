/* 
  File Name: listMyQuestionsByAd.js
  Description: This component is designed to display a list of questions related to a specific advertisement. 
               It fetches questions associated with an ad by its unique id retrieved from the URL parameters. 
               The component differentiates between regular users and admins, showing the appropriate UI elements based on their roles. 
               If the user is not authenticated, they are redirected to the sign-in page. Admins can view all questions and their answers, 
               while regular users can only view their own questions and respond to unanswered ones. 
  Team's name: BOFC 
  Group number: 04
  Date: November 23, 2024
*/

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { listQuestionsByAd } from "../../datasource/API-question";
import { getToken } from "../../components/auth/auth-helper";

const ListMyQuestions = ({ adID }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true); // Track loading state
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true'; // Convert to boolean
    const navigate = useNavigate();
    //const { adID } = useParams(); // Get adID from URL params to filter by specific ad

    // Check if the user is authenticated
    useEffect(() => {
        const token = getToken();
        if (!token) {
            // If not authenticated, redirect to the sign-in page
            navigate("/signin"); // Replace with your actual sign-in route
        } else {
            // If authenticated, fetch the user's questions for the specific ad
            const fetchMyQuestions = async () => {
                try {
                    const data = await listQuestionsByAd(adID); // Fetch questions by adID
                    setQuestions(data);
                } catch (error) {
                    alert("Failed to load your questions. Please try again.");
                } finally {
                    setLoading(false); // Set loading to false once the data is fetched
                }
            };
            fetchMyQuestions();
        }
    }, [navigate, adID]); // Ensure to refetch when adID changes

    // Handle navigating to the answer form
    const handleAnswer = (questionID) => {
        navigate(`/questions/Answer/${questionID}`);
    };

    return (
        <div className="container mt-5">
            {loading ? (
                <p>Loading...</p> // Show loading text while fetching questions
            ) : questions.length === 0 ? (
                <p>No questions found for this ad.</p> // Display no questions if the list is empty
            ) : (
                <div className="table-responsive mt-4">
                    <table className="table table-bordered table-striped table-hover" style={{ tableLayout: 'fixed', borderSpacing: '15px 0' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left' }}>Created on</th>
                                <th style={{  textAlign: 'left' }}>Question</th>
                                <th style={{  textAlign: 'left' }}>Answer</th>
                                {!isAdmin && <th style={{ textAlign: 'left' }}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((question) => (
                                <tr key={question.id}>
                                    <td>{new Date(question.createdDate).toLocaleDateString()}</td>
                                    <td>{question.question}</td>
                                    <td>{question.answer ? 
                                        (question.answer) : ('')}
                                    </td>
                                    <td>
                                    {!isAdmin && (
                                        question.answer ? (
                                        
                                        <><button
                                        className="btn btn-secondary"
                                        disabled // Disable the button if already answered
                                         >
                                        Answered
                                        </button>
                                        &nbsp;&nbsp;
                                        </>
                                        ) : (
                                            
                                            <>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleAnswer(question.id)} // Redirect to answer page
                                            >
                                                &nbsp; Answer&nbsp;&nbsp;
                                            </button>
                                            &nbsp;&nbsp;
                                            </>
                                        )
                                    )}
                                    
                                </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
    
            <br />
            <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
                Back
            </button>
        </div>
    );
    
};

// Export the component
export default ListMyQuestions;
