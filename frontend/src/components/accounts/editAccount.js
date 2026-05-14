/* 
  File Name: editAccount.js
  Description: This React component allows users to edit their account information, including first name, 
               last name, email, and username. It fetches current user data, updates the user information 
               via the API, and provides feedback on success or failure. The user is redirected after a successful update.
  Team's name: BOFC 
  Group number: 04
  Date: November 23, 2024
*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, updateUser } from '../../datasource/API-user';

const EditAccount = () => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
    });  // State to store user information
    const [error, setError] = useState('');  // State for error messages
    const [success, setSuccess] = useState('');  // State for success messages
    const navigate = useNavigate();  // Hook for programmatic navigation

    // Fetch user data when the component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            const response = await getUserInfo();  // Call the API to get user information
            if (response && response.success) {
                setUser({
                    id: response.data.id,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email,
                    username: response.data.username,
                });  // Set user data if API call is successful
            } else {
                setError(response.message || 'Failed to fetch user data.');  // Set error if API fails
            }
        };
        fetchUserData();  // Trigger fetch on mount
    }, []);

    // Handle form input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser((prevData) => ({ ...prevData, [name]: value }));  // Update user state on input change
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();  // Prevent page reload on submit
        setError('');  // Clear previous error
        setSuccess('');  // Clear previous success message
        const response = await updateUser(user.id, user);  // Call the API to update user information
        if (response && response.success) {
            setSuccess('Account updated successfully!');  // Set success message
            console.log("Redirecting with refreshed state", { refreshed: true });
            setTimeout(() => navigate('/MyUser/MyAccount', { state: { refreshed: true } }), 3000);  // Redirect after 3 seconds
        } else {
            setError(response.message || 'Failed to update account.');  // Set error if update fails
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="offset-md-3 col-md-6">
                    <h1>Edit Account</h1>

                    {error && <p className="flash-error">{error}</p>} 
                    {success && <p className="flash-success">{success}</p>} 
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="firstNameField">First Name:</label>
                            &nbsp;&nbsp;
                            <input
                                type="text"
                                className="form-control"
                                id="firstNameField"
                                name="firstName"
                                value={user.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <br />
                        <div className="form-group">
                            <label htmlFor="lastNameField">Last Name:</label>
                            &nbsp;&nbsp;
                            <input
                                type="text"
                                className="form-control"
                                id="lastNameField"
                                name="lastName"
                                value={user.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <br />
                        <div className="form-group">
                            <label htmlFor="emailField">Email:</label>
                            &nbsp;&nbsp;
                            <input
                                type="email"
                                className="form-control"
                                id="emailField"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <br />
                        <div className="form-group">
                            <label htmlFor="usernameField">Username:</label>
                            &nbsp;&nbsp;
                            <input
                                type="text"
                                className="form-control"
                                id="usernameField"
                                name="username"
                                value={user.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <br />
                        <button className="btn btn-primary" type="submit">
                            <i className="fas fa-save"></i> Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditAccount;
