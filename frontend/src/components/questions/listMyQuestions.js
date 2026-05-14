/* 
  File Name: listMyQuestions.js
  Description: This component allows users to view a list of their previously submitted questions. 
               It displays the questions along with any answers, and provides functionality for 
               users to navigate to the answer form. The page also handles admin users differently 
               by showing a "Questions History" title and marking unanswered questions as "Pending".
               If a user is not authenticated, they are redirected to the sign-in page.
               Admin users can see all questions with their answers, while regular users can only 
               see their own questions and answers. 
  Team's name: BOFC 
  Group number: 04
  Date: November 23, 2024
*/

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listMyQuestions } from "../../datasource/API-question";
import { getToken } from "../../components/auth/auth-helper";
import { read } from "../../datasource/API-Ads";

const ListMyQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [loadingQuestions, setLoadingQuestions] = useState(true); // Track loading state for questions
    const [adDetails, setAdDetails] = useState({}); // Track ad details for each question
    const [loadingAds, setLoadingAds] = useState(true); // Track loading state for ad details
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true'; // Convert to boolean
    const navigate = useNavigate();

    // Check if the user is authenticated
    useEffect(() => {
        const token = getToken();
        if (!token) {
            // If not authenticated, redirect to the sign-in page
            navigate("/signin"); // Replace with your actual sign-in route
        } else {
            // If authenticated, fetch the user's questions
            const fetchMyQuestions = async () => {
                try {
                    const data = await listMyQuestions();
                    // Ensure the fetched data is an array before setting it
                    if (Array.isArray(data)) {
                        setQuestions(data);
                    } else {
                        setQuestions([]); // Set an empty array if the data is invalid
                    }
                } catch (error) {
                    alert("Failed to load your questions. Please try again.");
                } finally {
                    setLoadingQuestions(false); // Set loading to false once the questions are fetched
                }
            };
            fetchMyQuestions();
        }
    }, [navigate]);

    // Fetch the ad details for each question after the questions are loaded
    useEffect(() => {
    const fetchAdDetails = async () => {
        try {
            const adPromises = questions.map(async (question) => {
                const adData = await read(question.adID);
                return { id: question.id, adData }; // Return a pair of question id and ad data
            });
            
            // Wait for all promises to resolve
            const adResults = await Promise.all(adPromises);

            // Map results to an object with question ids as keys
            const details = adResults.reduce((acc, { id, adData }) => {
                acc[id] = adData;
                return acc;
            }, {});

            setAdDetails(details); // Save all ad details
            setLoadingAds(false); // Set loading to false once the ad details are fetched
        } catch (error) {
            console.error("Error fetching ad details:", error);
        }
    };

    if (questions.length > 0) {
        fetchAdDetails(); // Only fetch ad details once questions are available
    }
}, [questions]);

    // Handle navigating to the answer form
    const handleAnswer = (questionID) => {
        navigate(`/questions/Answer/${questionID}`);
    };

    // Render the table only once both questions and ad details are loaded
    if (loadingQuestions || loadingAds) {
        return <p>Loading...</p>; // Show loading text until both are ready
    }

    return (
        <div className="container mt-5">
            <h1>{isAdmin ? "Questions History" : "My Questions"}</h1>
            <br />
            <div className="table-responsive mt-4">
                <table className="table table-bordered table-striped table-hover" style={{ tableLayout: 'fixed' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '25%', textAlign: 'left' }}>Ad Title</th>
                            <th style={{ width: '30%', textAlign: 'left' }}>Question</th>
                            <th style={{ width: '30%', textAlign: 'left' }}>Answer</th>
                            <th style={{ width: '15%', textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((question) => (
                            <tr key={question.id}>
                                <td>{adDetails[question.id] ? adDetails[question.id].title : "Loading..."}</td>
                                <td>{question.question}</td>
                                <td>
                                    {question.answer ? (
                                        <span>{question.answer}</span>
                                    ) : ('')}
                                </td>
                                <td>
                                    {!isAdmin && (
                                        question.answer ? (
                                            <>
                                            <button className="btn btn-secondary" disabled>
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
                                    
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => navigate(`/Ads/Details/${question.adID}`)}
                                    >
                                        Ad
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
                Back
            </button>
        </div>
    );
};

// Export the component
export default ListMyQuestions;


