/* 
  File Name: listAds.js
  Description: React component to display the list of ads created by the logged-in user or all ads for administrators. 
               Allows filtering ads by category, disabling ads, and removing ads through respective API calls. 
               Includes conditional functionality for regular users and administrators.
  Team's name: BOFC 
  Group number: 04
  Date: November 23, 2024
*/

// Importing required libraries, hooks, and API functions
import { useEffect, useState } from "react";
import { listByOwner, listByAdmin,remove, disable } from "../../datasource/API-Ads";
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from "../auth/auth-helper";

// ListMyAds Component
const ListMyAds = () => {
  const [adsList, setAdsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true'; // Convert to boolean
  const navigate = useNavigate();

  // Fetch ads based on user type (Admin or Owner) and selected category
  useEffect(() => {
    const fetchCategory = category === "All" ? "all" : category; // Adjust category filter

    setAdsList([]);   // Clear previous ads to avoid data conflicts
    setIsLoading(true); // Set loading state to true during fetch

    // Call the appropriate API based on user role
    if(!isAdmin){
    listByOwner(fetchCategory).then((data) => {
      if (data) {
        setAdsList(data); // Update state with fetched ads
        setIsLoading(false); 
      }
    }).catch((err) => {
      alert(err.message);
      console.error(err);
    });
  }else{
    listByAdmin(fetchCategory).then((data) => {
      if (data) {
        setAdsList(data);
        setIsLoading(false); 
      }
    }).catch((err) => {
      alert(err.message);
      console.error(err);
    });
  }
  }, [category]); // Re-run the effect when the category changes

  // Function to disable an ad
  const handleDisable = async (id) => {
    const confirmDisable = window.confirm("Are you sure you want to disable this ad?");
    
    if (!confirmDisable) return; // Exit if the user cancels
    
    try {
      const data = await disable(id);

      if (data && data.success) {
        alert("Ad disabled successfully.");
        // Refresh the ads list after disabling
        listByOwner(category).then((data) => {
          if (data) {
            setAdsList(data);
          }
        }).catch((err) => {
          alert("Failed to refresh ads list.");
          console.error("Error fetching ads after disabling:", err);
        });
      } else {
        alert(data?.message || "Failed to disable the ad.");
      }
    } catch (err) {
      alert("An error occurred while disabling the ad.");
      console.error("Error details:", err);
    }
  };

  // Function to remove an ad
  const handleRemove = (id) => {
    if (!isAuthenticated())
        window.alert('You are not authenticated. Please, proceed with sign-in first.')
    else {
        if (window.confirm('Are you sure you want to delete this item?')) {
          // Find the ad's title before removing it
          const adToRemove = adsList.find((ad) => ad.id === id); // Find the ad's id
          remove(id).then(data => {
                if (data && data.success) {
                    const newList = adsList.filter((ad) => ad.id !== id);
                    setAdsList(newList); // Update state after successful deletion
                    // Show success alert with the ad's title
                    window.alert(`The Ad "${adToRemove.title}" was deleted.`);
                }
                
                else {
                    alert(data.message);
                }
            }).catch(err => {
                alert(err.message);
                console.log(err)
            });
        };
    }
};

return (
  <main className="container" style={{ paddingTop: 5 }}>
    <div className="row">
      <h1>{isAdmin ? "Ads History" : "My Ads"}</h1>

      {/* Filter and Create Ad Button */}
      <div className="d-flex align-items-center justify-content-between w-100">
        <div>
          <label htmlFor="categoryFilter" className="form-label">
            Category Filter:
          </label>
          <select
            id="categoryFilter"
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Technology">Technology</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Videogames">Videogames</option>
            <option value="Musical Instruments">Musical Instruments</option>
          </select>
        </div>
        <br></br>
        {!isAdmin && (
          <div>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/Ads/Create")}
            >
              + Create Ad
            </button>
          </div>
        )}
      </div>

      <br></br>
      <div className="table-responsive mt-4">
        {isLoading && <div>Loading...</div>}
        {!isLoading && (!adsList || adsList.length === 0) && <div>No ads found.</div>}
        {!isLoading && adsList.length > 0 && (
          <table className="table table-bordered table-striped table-hover" style={{ tableLayout: 'fixed', borderSpacing: '15px 0' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Title</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'center' }}>Category</th>
                <th style={{ textAlign: 'center' }}>Price</th>
                <th style={{ textAlign: 'center' }}>Start Date</th>
                <th style={{ textAlign: 'center' }}>End Date</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adsList.map((ad, index) => (
                <tr key={index}>
                  <td>{ad.title}</td>
                  <td>
                    {ad.status === "active"
                      ? "Active"
                      : ad.status === "disabled"
                      ? "Disabled"
                      : "Expired"}
                  </td>
                  <td>{ad.category}</td>
                  <td>${ad.price}</td>
                  <td>{new Date(ad.startDate).toLocaleDateString()}</td>
                  <td>{new Date(ad.endDate).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm me-1"
                      type="button"
                      onClick={() => navigate(`/Ads/Details/${ad.id}`)}
                    >
                      Details
                    </button>
                    &nbsp;&nbsp;
                    {/* Conditional rendering of buttons based on the user's role */}
                    {!isAdmin && (
                      <>
                        <button
                          className="btn btn-primary btn-sm me-1"
                          type="button"
                          onClick={() => navigate(`/Ads/Edit/${ad.id}`)}
                          disabled={ad.status === "disabled"}
                        >
                          Edit
                        </button>

                        &nbsp;&nbsp;

                        {(ad.status === "active" || ad.status === "expired") && (
                          <button
                            className="btn btn-warning btn-sm me-1"
                            type="button"
                            onClick={() => handleDisable(ad.id)}
                          >
                            &nbsp;Disable&nbsp;
                          </button>
                        )}

                        {/* Show Disabled button if the ad is not active */}
                        {ad.status === "disabled" && (
                          <button className="btn btn-secondary" disabled>
                            Disabled
                          </button>
                        )}
                      </>
                    )}

                    {isAdmin && (
                      <button
                        className="btn btn-danger btn-sm"
                        type="button"
                        onClick={() => handleRemove(ad.id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </main>
);

};

// Exporting the ListMyAds component
export default ListMyAds;
