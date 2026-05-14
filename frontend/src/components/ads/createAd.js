/* 
  File Name: createAd.js
  Description: React component for creating a new advertisement. 
               Provides a form for users to input ad details including title, description, category, price, and dates. 
               Handles form submission with validations and calls the create API to save the ad data in the database.  
  Team's name: BOFC 
  Group number: 04
  Date: November 23, 2024
*/


// Importing necessary hooks and functions for the component
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { create } from "../../datasource/API-Ads";
import AdModel from "../../datasource/adModel";


// CreateAd Component
const CreateAd = () => {
    
     // Initializes navigation hook and state for ad data and categories
    let navigate = useNavigate();
    let [ad, setAd] = useState(new AdModel());
    let [categories] = useState(["Technology", "Home & Kitchen", "Videogames", "Musical Instruments"]); 

    // Updates the ad state when form input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setAd((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    // Clears the ad form and resets state to initial values
    const handleClear = () => {
        setAd(new AdModel());
    };

    // Handles the form submission, performs validations, and calls the API to create the ad
    const handleSubmit = (event) => {
        event.preventDefault();

        // Adjust the start and end dates
        const adjustedStartDate = (() => {
            let date = new Date(ad.startDate);
            date.setDate(date.getDate() + 1); // Adjust start date
            return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        })();

        const adjustedEndDate = (() => {
            let date = new Date(ad.endDate);
            date.setDate(date.getDate() + 1); // Adjust end date
            return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        })();

        // Validate that startDate is greater than today and endDate is greater than startDate
        const today = new Date();
        // if (new Date(adjustedStartDate) <= today) {
        //     alert("Start date must be in the future.");
        //     return;
        // }
        if (new Date(adjustedEndDate) <= new Date(adjustedStartDate)) {
            alert("End date must be later than the start date.");
            return;
        }

         // Validates that price is positive
        if (ad.price <= 0) {
            alert("Price must be a positive number.");
            return;
        }

        // Prepare the ad data with adjusted start and end dates
        const adData = {
            ...ad,
            startDate: adjustedStartDate,
            endDate: adjustedEndDate,
        };

        // Calls the API to create the ad and handles the response
        create(adData)
            .then((response) => {

                console.log(response);
                if (response && response.id) {
                    alert("Ad successfully created with the ID: " + response.id);
                } else {
                    alert(response.message);
                }
            })
            .catch((err) => {
                alert(err.message);
                console.log(err);
            });
    };

    // Form to create a new advertisement by filling out it.
    return (
        <div className="container" style={{ paddingTop: 5 }}>
            <div className="row">
                <div className="offset-md-3 col-md-6">
                    <h1>Create a New Ad</h1>

                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-group">
                            <label htmlFor="titleTextField">Title:</label>
                            &nbsp;&nbsp;
                            <input
                                type="text"
                                className="form-control"
                                id="titleTextField"
                                placeholder="Enter the Ad Title"
                                name="title"
                                value={ad.title || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <br />
                        <div className="form-group">
                            <label htmlFor="descriptionTextField">Description:</label>
                            &nbsp;&nbsp;
                            <textarea
                                className="form-control"
                                id="descriptionTextField"
                                placeholder="Enter the Ad Description"
                                name="description"
                                value={ad.description || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <br />
                        <div className="form-group">
                            <label htmlFor="categorySelect">Category:</label>
                            &nbsp;&nbsp;
                            <select
                                className="form-control"
                                id="categorySelect"
                                name="category"
                                value={ad.category || ""}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>
                                    Select a category
                                </option>
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <br />
                        <div className="form-group">
                            <label htmlFor="priceTextField">Price($):</label>
                            &nbsp;&nbsp;
                            <input
                                type="number"
                                className="form-control"
                                id="priceTextField"
                                placeholder="Enter the Price"
                                name="price"
                                value={ad.price || ""}
                                onChange={handleChange}
                                min="0.01"
                                step="0.01"
                                required
                            />
                        </div>

                        <br />
                        <div className="form-group">
                            <label htmlFor="startDatePicker">Start Date:</label>
                            &nbsp;&nbsp;
                            <input
                                type="date"
                                className="form-control"
                                id="startDatePicker"
                                name="startDate"
                                value={ad.startDate || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <br />
                        <div className="form-group">
                            <label htmlFor="endDatePicker">End Date:</label>
                            &nbsp;&nbsp;
                            <input
                                type="date"
                                className="form-control"
                                id="endDatePicker"
                                name="endDate"
                                value={ad.endDate || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <br />
                        <div className="form-group">
                            <button className="btn btn-primary" type="submit">
                                <i className="fas fa-edit"></i> Submit
                            </button>
                            &nbsp;&nbsp;
                            <button
                                className="btn btn-warning"
                                type="button"
                                onClick={handleClear}
                            >
                                Clear
                            </button>
                            &nbsp;&nbsp;
                            <button
                            className="btn btn-secondary me-2"
                            type="button"
                            onClick={() => navigate(-1)}
                            >
                            Back
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Exporting the CreateAd component to use in other parts of the application
export default CreateAd;
