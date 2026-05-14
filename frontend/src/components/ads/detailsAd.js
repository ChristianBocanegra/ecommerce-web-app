/* 
  File Name: detailsAd.js
  Description: React component for displaying the details of a specific advertisement. 
               Allows admins to delete or view user information, and allows owners to disable or edit their ads.
               Fetches ad details from the API based on the user's role (admin or owner) and handles actions like disabling, editing, or deleting the ad.
  Team's name: BOFC 
  Group number: 04
  Date: November 23, 2024
*/

// Importing necessary hooks and functions for the component
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { readByOwner, readByAdmin } from "../../datasource/API-Ads";
import { isAuthenticated } from "../auth/auth-helper";
import { disable,remove } from "../../datasource/API-Ads"; // Import disable function
import ListMyQuestions from "../questions/listMyQuestionsByAd";
// AdDetails Component
const AdDetails = () => {
  const { id } = useParams(); // Get the ad ID from the route params
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAdmin = sessionStorage.getItem("isAdmin") === "true"; // Check if user is an admin
  const isOwner = isAuthenticated() && !isAdmin; // Check if user is the ad owner

  // Fetch ad details based on user role (admin or owner)
  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        setIsLoading(true);
        console.log(id);
        let data;
        if (isAdmin) {
          data = await readByAdmin(id); // Fetch details for admin
        } else if (isOwner) {
          data = await readByOwner(id); // Fetch details for the owner
        } 
        if (data && data.success === false) {
          setError(data.message || "Failed to fetch ad details.");
        } else {
          setAd(data); // Set fetched ad data
        }
      } catch (err) {
        setError("An unexpected error occurred while fetching the ad details.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdDetails();
  }, [id, isAdmin, isOwner]);


  // Handles disabling the ad
const handleDisable = async () => {
  const confirmDisable = window.confirm("Are you sure you want to disable this ad?");
  
  if (!confirmDisable) return; // Exit if the user cancels
  
  try {
      const data = await disable(id); // Use the `id` from the URL parameter here
  
      if (data && data.success) {
          alert("Ad disabled successfully.");
          // Refresh the ad details after disabling
          const updatedAd = { ...ad, status: 'disabled' }; // Set the ad's status to 'disabled'
          setAd(updatedAd);
      } else {
          alert(data?.message || "Failed to disable the ad.");
      }
  } catch (err) {
      alert("An error occurred while disabling the ad.");
      console.error("Error details:", err);
  }
};


   // Handles removing the ad
  const handleRemove = async () => {
    if (!isAuthenticated()) {
      alert("You are not authenticated. Please, proceed with sign-in first.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this ad?");
    if (!confirmDelete) return;

    try {
      const data = await remove(id); // Remove the ad using the ID

      if (data && data.success) {
        alert(`The Ad "${ad.title}" was deleted successfully.`);
        navigate(-1); // Navigate back to the previous page or list view
      } else {
        alert(data?.message || "Failed to delete the ad.");
      }
    } catch (err) {
      alert("An error occurred while deleting the ad.");
      console.error("Error details:", err);
    }
  };

  // Show loading state while fetching ad details
  if (isLoading) {
    return <div>Loading ad details...</div>;
  }

  // Show error message if any error occurs
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  // Show message if ad not found
  if (!ad) {
    return <div className="alert alert-warning">Ad not found.</div>;
  }

    // Form to see the details of an advertisement.
  return (
    <div className="container mt-5">
      <div className="card">
      <div className="card-header" style={{ textAlign: 'center' }}>
          <h1 style={{ color: 'darkblue' }}>{ad.title}</h1>
          <hr></hr>
          <div className="card-footer">

          {isOwner && (
            <>
              <button
                className="btn btn-primary me-2"
                type="button"
                onClick={() => navigate(`/Ads/Edit/${id}`)}
                disabled={ad.status == "disabled"}
              >
                Edit
              </button>
              &nbsp; &nbsp;
              
              {(ad.status === "active" || ad.status === "expired") && (
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={handleDisable} // Call the function to disable the ad
                >
                  Disable
                </button>
              )}

              &nbsp; &nbsp;
              {ad.status === "disabled" && (
                <button className="btn btn-secondary" disabled>
                  Disabled
                </button>
              )}
            </>
          )}

          {isAdmin && (
            <button
              className="btn btn-danger"
              onClick={handleRemove}
              type="button"
            >
              Delete
            </button>
          )}
        </div>
        </div>
        <div className="card-body">
          <p><strong>Description:</strong> {ad.description}</p>
          <p><strong>Category:</strong> {ad.category}</p>
          <p><strong>Price:</strong> ${ad.price}</p>
          <p>
            <strong>Status:</strong> 
            {ad.status === "active" && <span className="text-success"> Active</span>}
            {ad.status === "disabled" && <span className="text-warning"> Disabled</span>}
            {ad.status === "expired" && <span className="text-danger"> Expired</span>}
          </p>
          {console.log("Hi")}
          {console.log(isAdmin)}
          {console.log(isAuthenticated())}
          
          {/* Show User info only for admins */}
          {isAdmin && (
            <p><strong>User:</strong> {ad.userName}</p>
          )}
          
          <p>
            <strong>Start Date:</strong> {new Date(ad.startDate).toLocaleDateString()}
          </p>
          <p>
            <strong>End Date:</strong> {new Date(ad.endDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Created:</strong> {new Date(ad.created).toLocaleDateString()}
          </p>
          <p>
            <strong>Last Updated:</strong> {new Date(ad.updated).toLocaleDateString()}
          </p>
        </div>
      </div>

      <h2 style={{ textAlign: 'left' }}>Users Questions:</h2>
      <ListMyQuestions adID={id} /> 
    </div>
  );

};

// Exporting the AdDetails component for use in other parts of the application
export default AdDetails;
