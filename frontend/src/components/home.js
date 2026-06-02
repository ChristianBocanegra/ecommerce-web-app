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

const ListInventory = () => {
    const navigate = useNavigate();
    const location = useLocation();

    let [adList, setAdList] = useState([]);
    let [isLoading, setIsLoading] = useState(true);
    let [category, setCategory] = useState('all');

    useEffect(() => {
        const currentPath = location.pathname;
        const newCategory = decodeURIComponent(currentPath.split('/').filter(Boolean).pop() || 'all');

        if (newCategory !== category) {
            setCategory(newCategory);
        }

        setIsLoading(true);
        list(newCategory).then((data) => {
            if (data) setAdList(data);
        })
        .catch((err) => {
            alert("Error fetching data: " + err.message);
            console.error(err);
        })
        .finally(() => setIsLoading(false));
    }, [location.pathname]);

    const placeholderImage = (category) => {
        const placeholders = {
            "Technology": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
            "Home & Kitchen": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
            "Videogames": "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&q=80",
            "Musical Instruments": "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=80",
        };
        return placeholders[category] || "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&q=80";
    };

    return (
        <main className="container" style={{ paddingTop: 24 }}>
            <h1 style={{ color: '#1a1a6e', fontWeight: 700, marginBottom: 24 }}>Products List</h1>

            {isLoading && <div className="text-center py-5">Loading...</div>}

            {!isLoading && adList.length === 0 && (
                <div className="text-center py-5 text-muted">
                    Unfortunately there are no products in this category.
                </div>
            )}

            {/* Cards Grid */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {adList
                    .filter((ad) => category === 'all' || ad.category === category)
                    .map((ad, i) => (
                        <div className="col" key={i}>
                            <div className="card h-100 shadow-sm" style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e0e0e0' }}>

                                {/* Product Image */}
                                <img
                                    src={ad.imageUrl || placeholderImage(ad.category)}
                                    alt={ad.title}
                                    style={{ width: '100%', height: 200, objectFit: 'cover' }}
                                    onError={(e) => { e.target.src = placeholderImage(ad.category); }}
                                />

                                <div className="card-body d-flex flex-column">
                                    {/* Title */}
                                    <h5 className="card-title" style={{ fontWeight: 600 }}>{ad.title}</h5>

                                    {/* Category */}
                                    <p className="text-muted small mb-1">{ad.category}</p>

                                    {/* Price */}
                                    <p style={{ fontSize: 22, fontWeight: 700, color: '#e07b00' }}>${ad.price}</p>

                                    {/* Dates */}
                                    <p className="text-muted small mb-3">
                                        {new Date(ad.startDate).toLocaleDateString()} → {new Date(ad.endDate).toLocaleDateString()}
                                    </p>

                                    {/* Details Button */}
                                    <div className="mt-auto">
                                        <button
                                            className="btn btn-outline-primary btn-sm w-100"
                                            onClick={() => navigate(`/Home/Ads/Details/${ad.id}`)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </main>
    );
};

export default ListInventory;