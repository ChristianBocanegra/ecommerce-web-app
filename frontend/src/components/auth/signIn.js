/* 
  File Name: signin.js
  Description: React component for the Sign In page. Handles user authentication by submitting the email and password,
               sets admin status if the user is an admin, and navigates to the previous page or home page upon successful login.
  Team's name: BOFC
  Group number: 04
  Date: November 23, 2024
*/

// Importing required libraries and functions
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { signin } from "../../datasource/API-user";
import { authenticate } from "./auth-helper";


const Signin = () => {

    // Get location state (for navigation after login)
    const { state } = useLocation();
    // Default to home page if no previous location
    const { from } = state || { from: { pathname: '/' } };
    // State to hold error message if authentication fails
    const [errorMsg, setErrorMsg] = useState('')
    // State to hold user input (email and password)
    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    // Hook to navigate to different routes
    let navigate = useNavigate();

    // Handle changes to the input fields (email and password)
    const handleChange = (event) => {
        const { name, value } = event.target; // Extract name and value from the target element
        setUser((prevFormData) => ({ ...prevFormData, [name]: value })); // keep other form data unchanged
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        
        // Call the signin API with the user input
        signin(user).then((response) => {
            // If successful, store the admin flag in session storage
            if (response && response.success) {
                const isAdminFlag = response.user && response.user.isAdmin; // Assuming API returns a user object with `isAdmin`
                sessionStorage.setItem('isAdmin', isAdminFlag);

                // Authenticate with the returned token
                authenticate(response.token, () => {
                    // Navigate to the previous page or homepage
                    navigate(from, { replace: true });

                });
            } else {
                setErrorMsg(response.message);
            }
        }).catch((err) => {
            setErrorMsg(err.message);
            console.log(err);
        });
    };

    return (           
            <div className="container">
                <div className="row">
                    <div className="offset-md-3 col-md-6">
                        <h1>Sign In</h1>
                        <p className="flash"><span>{errorMsg}</span></p>
                        <form onSubmit={handleSubmit} className="form">
                            <div className="form-group">
                                <label htmlFor="emailTextField">Email</label> 
                                <input type="text" className="form-control"
                                    id="emailTextField"
                                    placeholder="Enter your email"
                                    name="email"
                                    value={user.email || ''}
                                    onChange={handleChange}
                                    required>
                                </input>
                            </div>
                            <br />
                            <div className="form-group">
                                <label htmlFor="passowordTextField">Password</label>
                                <input type="password" className="form-control"
                                    id="passowordTextField"
                                    placeholder=""
                                    name="password"
                                    value={user.password || ''}
                                    onChange={handleChange}
                                    required>
                                </input>
                            </div>
                            <br />

                            <button className="btn btn-primary" type="submit">
                                <i className="fas fa-edit"></i>
                                Submit
                            </button>
                            &nbsp; &nbsp;
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate("/Register")}
                            >
                            Register
                            </button>

                        </form>
                    </div>

                </div>
            </div>
    );
}

// Exporting Signin component to be used in other parts of the application
export default Signin;