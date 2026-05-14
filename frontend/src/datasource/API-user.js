/* 
  File Name: API-user.js
  Description: This file contains functions for interacting with user-related endpoints of the API. 
               It supports user authentication (signin and signup), retrieving user information, 
               updating user profiles, and logging out.
  Team's Name: BOFC
  Group Number: 04
  Date: November 23, 2024
*/

// Import the helper function for retrieving the authentication token
import { getToken } from "../components/auth/auth-helper";

// Define the base URL for API requests from environment variables
let apiURL = process.env.REACT_APP_APIURL;

// Signs in a user by sending their credentials to the API.
const signin = async (user) => {
    try {
        let response = await fetch(apiURL + '/users/signin', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

// Registers a new user by sending their data to the API.
const signup = async (user) => {
    try {
        let response = await fetch(apiURL + '/users/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        });
        return await response.json();
    } catch (err) {
        console.error(err);
    }
};

// Retrieves the information of the currently logged-in user, requiring authentication.
const getUserInfo = async () => {
    try {
        console.log("Sending request to:", `${apiURL}/users/me`);

        const response = await fetch(`${apiURL}/users/me`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken(),
            },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            console.error("Error in response:", response.statusText);
            return {
                success: false,
                message: response.statusText || "Failed to fetch user info",
            };
        }

        const data = await response.json();
        console.log("Response data:", data);

        return data;
    } catch (err) {
        console.error("Error fetching user info:", err);
        return {
            success: false,
            message: "Failed to fetch user info",
        };
    }
};

// Updates the information of an existing user. Requires authentication.
const updateUser = async (userId, userData) => {
    try {
        let response = await fetch(`${apiURL}/users/edit/${userId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify(userData)
        });
        return await response.json();
    } catch (err) {
        console.error(err);
        return {
            success: false,
            message: "Failed to update user."
        };
    }
};

// Logs out the user by sending a signout request to the API.
const logOut = async (idUser) => {
    try {
        let response = await fetch(apiURL + '/myuser/signout/' + idUser, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify()
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};


// List non-admin users
const listUsers = async () => {
    try {
        const response = await fetch(`${apiURL}/users/Adminuser/List-non-admin-users`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken(),
            },
        });

        const result = await response.json();
        console.log("API Response:", result);

        const users = result.data || [];
        if (!Array.isArray(users)) {
            console.error("Expected an array of users but got:", users);
            return [];
        }

        return users;
    } catch (err) {
        console.error("Error fetching users:", err);
        return [];
    }
};

// Remove a user by their ID
const removeUser = async (userId) => {
    try {
        const response = await fetch(`${apiURL}/users/delete/${userId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken(),
            },
        });

        if (!response.ok) {
            console.error("Failed to delete user:", response.statusText);
            return {
                success: false,
                message: response.statusText || "Failed to delete user",
            };
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error deleting user:", err);
        return {
            success: false,
            message: "Failed to delete user.",
        };
    }
};

// Export user-related API service functions for use in other modules
export { signin, signup, getUserInfo, updateUser, logOut, listUsers, removeUser }
