/* 
  File Name: home.js
  Description: React component to display a list of ads filtered by category, either 'all' or a specific category. 
               The component dynamically updates the displayed ads based on the URL, allowing users to view ads in specific categories. 
               Includes functionality for loading and handling errors when fetching data.
  Team's name: BOFC 
  Group number: 04
  Date: November 23, 2024
*/

// Importing required libraries and hooks
import { useEffect, useState } from "react";
import { list } from "../datasource/API-Ads";
import { useNavigate, useLocation } from "react-router-dom";

// ListInventory Component
const ListInventory = () => {

    const navigate = useNavigate();
    const location = useLocation(); // Hook para detectar cambios en la URL

    let [adList, setAdList] = useState([]); // Lista de anuncios
    let [isLoading, setIsLoading] = useState(true);
    let [category, setCategory] = useState('all'); // Categoría actual

    // Effect hook to fetch data whenever the URL changes
    useEffect(() => {

         /// Extract category from the URL path (e.g., "/Technology" or "/")
         const currentPath = location.pathname; 
 
         const newCategory = decodeURIComponent(currentPath.split('/').filter(Boolean).pop() || 'all');

         // Update category if it has changed
         if (newCategory !== category) {
            setCategory(newCategory);
            console.log("Category changed to:", newCategory);
        }
    // Set loading state to true before fetching data
        setIsLoading(true);
    // Fetch the ads data for the current category
    list(newCategory).then((data) => {
            console.log("Data fetched for category:", newCategory);
            if (data) {
                setAdList(data); // Update the ad list with fetched data
            }
        })
        .catch((err) => {
            alert("Error fetching data: " + err.message);
            console.error(err);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, [location.pathname]);  // Dependency array: re-run the effect whenever the URL changes

    return (
        <main className="container" style={{ paddingTop: 5 }}>
            <div className="row">
                <h1>Products List</h1>
                <br />
                <br />
                <div className="table-responsive">
                    {isLoading && <div>Loading...</div>}
                    {!isLoading && adList.length === 0 && <div>Unfortunately there is no products in this category</div>}
                    {!isLoading && adList.length > 0 && 
                        <table className="table table-bordered table-striped table-hover" style={{ tableLayout: 'fixed', borderSpacing: '15px 0' }}>
                            <thead>
                                {/* -- Header Row-- */}
                                <tr>
                                    <th style={{ textAlign: 'center' }}>Title</th>
                                    <th style={{ textAlign: 'center' }}>Category</th>
                                    <th style={{ textAlign: 'center' }}>Price</th>
                                    <th style={{ textAlign: 'center' }}>Start Date</th>
                                    <th style={{ textAlign: 'center' }}>End Date</th>
                                    <th style={{ textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Filtrar y mapear los elementos según la categoría */}
                                {adList
                                    .filter((ad) => category === 'all' || ad.category === category) // Filtrar por categoría
                                    .map((ad, i) => (
                                        <tr key={i}>
                                            {console.log(ad)}
                                            <td className="text-center"> {ad.title || ''} </td>
                                            <td className="text-center"> {ad.category || ''} </td>
                                            <td className="text-center"> {ad.price || ''} </td>
                                            <td className="text-center"> {new Date(ad.startDate).toLocaleDateString()}</td>
                                            <td className="text-center"> {new Date(ad.endDate).toLocaleDateString()}</td>

                                            <td className="text-center">
                                                <button
                                                    className="btn btn-info btn-sm me-1"
                                                    onClick={() => navigate(`/Home/Ads/Details/${ad.id}`)}
                                                >
                                                    Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>}
                </div>
            </div>
        </main>
    );
};

// Export the ListInventory component
export default ListInventory;