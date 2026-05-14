/* 
  File Name: account.js
  Description: This React component fetches and displays user account information, including 
               first name, last name, email, and username. It handles loading, error states, 
               and allows users to navigate to different sections such as My Questions, My Ads, 
               and Edit Account.
  Team's name: BOFC 
  Group number: 04
  Date: November 23, 2024
*/

import React, { useEffect, useState } from 'react';
import { getUserInfo } from '../../datasource/API-user';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Account = () => {
    const [user, setUser] = useState(null);  // State to store user data
    const [loading, setLoading] = useState(true);  // State to track loading status
    const [error, setError] = useState(null);  // State to store error message
    const location = useLocation();  // Hook to get the current location object
    const navigate = useNavigate();  // Hook for programmatic navigation

    // Function to fetch user info from the API
    const fetchUserInfo = async () => {
        try {
            console.log("Fetching user info");
            const data = await getUserInfo();  // Call the API to get user information
            console.log("User info response:", data);
    
            if (data && data.success) {
                setUser(data.data);  // Set user data if the API call is successful
                console.log("User data set:", data.data);
            } else {
                console.error(data ? data.message : "Failed to fetch user info");
                setError(data ? data.message : "Failed to fetch user info");  // Set error if API fails
            }
        } catch (err) {
            console.error("Error fetching user info:", err);
            setError("Error fetching user info");  // Set error if there is an exception
        } finally {
            setLoading(false);  // Set loading to false once the fetch operation is complete
        }
    };

    useEffect(() => {
        fetchUserInfo();  // Fetch user information when the component mounts
    }, []);

    useEffect(() => {
        // Refresh user info if location state indicates the user was recently refreshed
        if (location.state?.refreshed) {
            console.log("Refreshing user info after edit", location.state);
            fetchUserInfo();  // Re-fetch user info if state is refreshed
        }
    }, [location.state]);

    if (loading) {
        return <p>Loading...</p>;  // Display loading message while fetching data
    }

    if (error) {
        return <p>Error: {error}</p>;  // Display error message if there's an issue fetching user info
    }

    return (
        <div>
            <h1>Account Information</h1>
            {user ? (
                <div>
                    <p><strong>First Name:</strong> {user.firstName}</p>
                    <p><strong>Last Name:</strong> {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                </div>
            ) : (
                <p>No user information available.</p>  // Display if no user data is available
            )}
            <div style={{ marginTop: '20px' }}>
                <button onClick={() => navigate("/Myuser/MyAccount/Edit")} className="btn">
                    Edit Account
                </button>
            </div>
        </div>
    );
};

export default Account;


