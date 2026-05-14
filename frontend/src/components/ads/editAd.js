/* 
  File Name: editAd.js
  Description: React component for editing an existing advertisement. 
               Allows the ad owner to update the details such as title, description, category, price, start date, and end date.
               Fetches the ad details based on the ad ID and updates the ad information through an API.
  Team's name: BOFC 
  Group number: 04
  Date: November 23, 2024
*/

// Importing necessary hooks and functions for the component
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { read, update } from "../../datasource/API-Ads"; // Importing API functions to read and update the ad
import AdModel from "../../datasource/adModel"; // Importing the AdModel to structure the ad data


// EditAd Component
const EditAd = () => {
    let navigate = useNavigate(); // Hook to navigate between pages
    let { id } = useParams(); // Get the ad ID from the route parameters
    let [ad, setAd] = useState(new AdModel()); // State to hold the ad data, initially set to a new AdModel instance
    let [categories] = useState(["Technology", "Home & Kitchen", "Videogames", "Musical Instruments"]); // Predefined categories for the ad

    // Load ad data when the component mounts
    useEffect(() => {
    
        read(id).then((response) => {  // Fetch the ad data from the API
            if (response) {
                
                console.log("Here is the response");
                console.log(response);

                // If the response is valid, set the ad state with the fetched data
                setAd(new AdModel(
                    response.title || "",           // title
                    response.description || "",     // description
                    response.category || "",        // category
                    response.owner || "",           // owner
                    response.userName || "",        // userName
                    response.price || 0,            // price
                    response.status || "active",    // status
                    new Date(response.startDate).toLocaleDateString("en-CA") || "", // startDate
                    new Date(response.endDate).toLocaleDateString("en-CA") || "",   // endDate
                    response.message || "",         // message
                    response.created || "",         // created
                    response.updated || "",         // updated
                    response.collection || ""       // collection
                ));
            }
        }).catch(err => {
            alert(err.message);
            console.log(err);
        });
    }, [id]); // Dependency array to run the effect when the ad ID changes

    // Handle changes in input fields
    const handleChange = (event) => {
        const { name, value } = event.target;
        setAd((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    // Clear the ad form
    const handleClear = () => {
        setAd(new AdModel());
    };

     // Handle form submission to update the ad
    const handleSubmit = (event) => {
        event.preventDefault();
    
        // Log the current ad object to check the values
        console.log("Hi I sent this");
        console.log(ad.price);  // Log the price as it is
        console.log(ad.category);
        console.log(ad.startDate);
        console.log(ad.endDate);
        console.log(ad.id);
    
        // Ensure price is treated as a number
        const price = parseFloat(ad.price);
        console.log("Parsed Price:", price);  // Log the parsed price value
    
        if (isNaN(price) || price <= 0) {
            alert("Price must be a positive number.");
            return;
        }
    
        // Validate that startDate is greater than today and endDate is greater than startDate
        const today = new Date();
        // if (new Date(ad.startDate) <= today) {
        //     alert("Start date must be in the future.");
        //     return;
        // }
        if (new Date(ad.endDate) <= new Date(ad.startDate)) {
            alert("End date must be later than the start date.");
            return;
        }

        console.log("Here is the end date");

        console.log(new Date(ad.endDate));

        console.log("Here is todays date");

        console.log(today);
    
        // Update status based on new endDate
        let updatedStatus = ad.status;

        console.log("Here is  previous status");

        console.log(updatedStatus);


        if (new Date(ad.endDate) < today) {
            updatedStatus = "expired";
        } else if (updatedStatus === "expired") {
            updatedStatus = "active"; // Adjust back to active if endDate is future
        }

        console.log("Here is new status");

        console.log(updatedStatus);

        // Prepare the new ad object with validated data
        let newAd = {
            title: ad.title,
            description: ad.description,
            category: ad.category,
            price: price, // Ensure it's a number
            status: updatedStatus,
            startDate: (() => {
                let date = new Date(ad.startDate);
                date.setDate(date.getDate() + 1); // Adjust start date
                return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            })(),
            endDate: (() => {
                let date = new Date(ad.endDate);
                date.setDate(date.getDate() + 1); // Adjust end date
                return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            }
        )()
        };
    
        // Log the new ad object before sending it to the API
        console.log("New Ad Object:", newAd);
    
        // Update the ad by calling the update API function
        update(id, newAd)
            .then((response) => {
                console.log("API Response:", response); // Log the API response
                if (response && response.success) {
                    alert("Ad successfully updated!"); // Show success message
                    navigate("/MyUser/Ads"); // Navigate to the ads page after update
                } else {
                    alert(response.message);
                }
            })
            .catch((err) => {
                alert(err.message);
                console.log("Error:", err); // Log the error if the request fails
            });
    };
    
    // JSX for rendering the EditAd form
    return (
        <div className="container" style={{ paddingTop: 5 }}>
            <div className="row">
                <div className="offset-md-3 col-md-6">
                    <h1>Edit Ad</h1>

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

// Exporting the EditAd component
export default EditAd;
