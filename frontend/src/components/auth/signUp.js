/* 
  File Name: signUp.js
  Description: This React component handles user registration by collecting necessary user information (first name, last name, email, username, and password). 
               It sends the data to the API to create an account, provides feedback on success or failure, 
               and redirects the user to the sign-in page upon successful registration.
  Team's name: BOFC 
  Group number: 04
  Date: November 23, 2024
*/


// Importing required libraries and functions
import { useState } from "react";
import { signup } from "../../datasource/API-user";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
    const [errorMsg, setErrorMsg] = useState('');  // State to store error message
    const [successMsg, setSuccessMsg] = useState('');  // State to store success message
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: ''
    });  // State to store user input for registration

    let navigate = useNavigate();  // Hook for programmatic navigation

    // Handle input changes in the form fields
    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser((prevFormData) => ({ ...prevFormData, [name]: value }));  // Update user state with the input field values
    };

    // Handle form submission for sign-up
    const handleSubmit = (event) => {
        event.preventDefault();  // Prevent page reload on form submit
        signup(user).then((response) => {  // Call API to create a new user
            if (response && response.success) {
                setSuccessMsg("Account created successfully! Redirecting...");
                setTimeout(() => navigate("/signin"), 3000);  // Redirect to sign-in page after 3 seconds
            } else {
                setErrorMsg(response.message || "Signup failed. Try again.");  // Display error message if signup fails
            }
        }).catch(err => {
            setErrorMsg(err.message || "An error occurred.");  // Handle errors during API call
        });
    };

    return (
        <div className="container">
            <div className="row">
                <div className="offset-md-3 col-md-6">
                    <h1>Sign Up</h1>
                    {errorMsg && <p className="flash-error">{errorMsg}</p>}  
                    {successMsg && <p className="flash-success">{successMsg}</p>}  
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-group">
                            <label htmlFor="firstNameField">First Name:</label>
                            &nbsp;&nbsp;
                            <input type="text" className="form-control"
                                id="firstNameField"
                                placeholder="Enter your first name"
                                name="firstName"
                                value={user.firstName}
                                onChange={handleChange}
                                required />
                        </div>
                        <br />
                        <div className="form-group">
                            <label htmlFor="lastNameField">Last Name:</label>
                            &nbsp;&nbsp;
                            <input type="text" className="form-control"
                                id="lastNameField"
                                placeholder="Enter your last name"
                                name="lastName"
                                value={user.lastName}
                                onChange={handleChange}
                                required />
                        </div>
                        <br />
                        <div className="form-group">
                            <label htmlFor="emailField">Email:</label>
                            &nbsp;&nbsp;
                            <input type="email" className="form-control"
                                id="emailField"
                                placeholder="Enter your email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                required />
                        </div>
                        <br />
                        <div className="form-group">
                            <label htmlFor="usernameField">Username:</label>
                            &nbsp;&nbsp;
                            <input type="text" className="form-control"
                                id="usernameField"
                                placeholder="Choose a username"
                                name="username"
                                value={user.username}
                                onChange={handleChange}
                                required />
                        </div>
                        <br />
                        <div className="form-group">
                            <label htmlFor="passwordField">Password:</label>
                            &nbsp;&nbsp;
                            <input type="password" className="form-control"
                                id="passwordField"
                                placeholder="Enter a password"
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                required />
                        </div>
                        <br />
                        <button className="btn btn-primary" type="submit">
                            <i className="fas fa-user-plus"></i> Sign Up
                        </button>
                        &nbsp; &nbsp;
                        <button
                                className="btn btn-primary"
                                onClick={() => navigate("/signin")}
                            >
                            Already have an account? Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
