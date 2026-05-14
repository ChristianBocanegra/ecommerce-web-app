/* 
  File Name: API-Ads.js
  Description: This file serves as an API for interacting with advertisement-related endpoints. 
               It includes functions for listing ads, creating, updating, disabling, retrieving, 
               and deleting advertisements. The API supports both public access and authenticated 
               access for various user roles such as owners and admins.
  Team's Name: BOFC
  Group Number: 04
  Date: November 23, 2024
*/


//Import necessary helper functions for handling authentication tokens 
import { getToken } from "../components/auth/auth-helper";

//Define the base URL for API requests from environment variables.
const apiURL = process.env.REACT_APP_APIURL;

// List all active ads in a category (publicly accessible)
const list = async (category) => {
    try {
      // Avoid empty category in the URL
      const fetchCategory = category ? category : "all";  // Default to "all"
      let response = await fetch(apiURL + '/ads/list/' +fetchCategory, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  };

/// List all ads by a specific owner (requires login)
const listByOwner = async (category) => {
    try {
        let response = await fetch(`${apiURL}/ads/myUser/list/${category}`, { 
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        });
        return await response.json();
    } catch (err) {
        console.error(err);
    }
};

// List all ads by an admin user (requires login)
const listByAdmin = async (category) => {
    try {
        let response = await fetch(`${apiURL}/ads/myAdminUser/list/${category}`, { 
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        });
        return await response.json();
    } catch (err) {
        console.error(err);
    }
};


// Create a new ad (requires login)
const create = async (ad) => {
    try {
        let response = await fetch(`${apiURL}/ads/myUser/create`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify(ad)
        });
        return await response.json();
    } catch (err) {
        console.error(err);
    }
};

// Update an ad (requires login)
const update = async (id, ad) => {
    try {
        console.log("Hi I received this in the API method");
        console.log(id);
        console.log(ad.price);  // Log the price as it is
        console.log(ad.category);
        console.log(ad.startDate);
        console.log(ad.endDate);
        console.log(ad.id);
        let response = await fetch(`${apiURL}/ads/myUser/edit/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify(ad)
        });
        return await response.json();
    } catch (err) {
        console.error(err);
    }
};

// Disable an ad (requires login)
const disable = async (id) => {
    try {
        let response = await fetch(`${apiURL}/ads/myUser/disable/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        });
        return await response.json();
    } catch (err) {
        console.error(err);
    }
};

// Get an ad by ID (publicly accessible)
const read = async (id) => {
    try {
        let response = await fetch(`${apiURL}/ads/get/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    } catch (err) {
        console.error(err);
    }
};

// Get an ad by ID (owner-specific access)
const readByOwner = async (id) => {
    try {
        let response = await fetch(`${apiURL}/ads/myUser/get/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        });
        return await response.json();
    } catch (err) {
        console.error(err);
    }
};

// Get an ad by ID (admin-specific access)
const readByAdmin = async (id) => {
    try {
        let response = await fetch(`${apiURL}/ads/myAdminUser/get/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        });
        return await response.json();
    } catch (err) {
        console.error(err);
    }
};



// Delete an ad by ID (Admin only)
const remove = async (id) => {
    try {
        let response = await fetch(`${apiURL}/ads/myAdminUser/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        });
        return await response.json();
    } catch (err) {
        console.error(err);
    }
};

// Export all ad-related API service functions for use in other modules
export { list, listByOwner, listByAdmin, create, update, disable, read, readByAdmin, readByOwner, remove };
