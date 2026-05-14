/* 
  File Name: auth-helper.js
  Description: This file contains utility functions for managing authentication.
               It allows storing, retrieving, and clearing authentication-related data 
               (e.g., token, username, user role, etc.) in session storage.
  Team's name: BOFC 
  Group number: 04
  Date: November 23, 2024
*/

// Importing the jwt-decode library to decode JWT tokens
import { jwtDecode } from "jwt-decode";

// authenticate function - Stores authentication data in sessionStorage
const authenticate = (token, cb) => {
     // Check if window object is defined (to ensure we are in a browser environment)
    if (typeof window !== "undefined") {
        // Store token and decoded data in sessionStorage
        sessionStorage.setItem('token', token);
        let decoded = jwtDecode(token);
        sessionStorage.setItem('username', decoded.username);
        sessionStorage.setItem('isAdmin', decoded.admin ? 'true' : 'false');
        sessionStorage.setItem('idUser', decoded.id);
    }
    cb(); // Callback function after authentication
};

// isAuthenticated function - Checks if the user is authenticated by verifying token existence
const isAuthenticated = () => {
    if (typeof window === "undefined") {
        return false;
    }
    return !!sessionStorage.getItem('token');
}

// getToken function - Retrieves the stored token from sessionStorage
const getToken = () => {
    if (typeof window === "undefined") {
        return false;
    }
    return sessionStorage.getItem('token');
}

// getUsername function - Retrieves the stored username from sessionStorage
const getUsername = () => {
    if (typeof window === "undefined") {
        return false;
    }
    return sessionStorage.getItem('username');
};

// getAdmin function - Retrieves the stored admin status from sessionStorage
const getAdmin = () => {
    if (typeof window === "undefined") {
        return false;
    }
    return sessionStorage.getItem('isAdmin');
}
// clearJWT function - Clears all authentication-related data from sessionStorage
const clearJWT = () => {
    if (typeof window !== "undefined") {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('isAdmin');
        sessionStorage.removeItem('idUser');
    }
}
// Exporting the functions for use in other parts of the application
export { authenticate, isAuthenticated, getToken, getUsername, getAdmin, clearJWT }