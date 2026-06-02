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
import { listByOwner, listByAdmin, remove, disable } from "../../datasource/API-Ads";
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from "../auth/auth-helper";

const ListMyAds = () => {
  const [adsList, setAdsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = category === "All" ? "all" : category;
    setAdsList([]);
    setIsLoading(true);

    if (!isAdmin) {
      listByOwner(fetchCategory).then((data) => {
        if (data) { setAdsList(data); setIsLoading(false); }
      }).catch((err) => { alert(err.message); console.error(err); });
    } else {
      listByAdmin(fetchCategory).then((data) => {
        if (data) { setAdsList(data); setIsLoading(false); }
      }).catch((err) => { alert(err.message); console.error(err); });
    }
  }, [category]);

  const handleDisable = async (id) => {
    if (!window.confirm("Are you sure you want to disable this ad?")) return;
    try {
      const data = await disable(id);
      if (data && data.success) {
        alert("Ad disabled successfully.");
        listByOwner(category).then((data) => { if (data) setAdsList(data); });
      } else {
        alert(data?.message || "Failed to disable the ad.");
      }
    } catch (err) {
      alert("An error occurred while disabling the ad.");
    }
  };

  const handleRemove = (id) => {
    if (!isAuthenticated()) { alert('Please sign in first.'); return; }
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    const adToRemove = adsList.find((ad) => ad.id === id);
    remove(id).then(data => {
      if (data && data.success) {
        setAdsList(adsList.filter((ad) => ad.id !== id));
        alert(`"${adToRemove.title}" was deleted.`);
      } else {
        alert(data.message);
      }
    }).catch(err => alert(err.message));
  };

  const statusBadge = (status) => {
    if (status === "active") return <span className="badge bg-success">Active</span>;
    if (status === "disabled") return <span className="badge bg-secondary">Disabled</span>;
    return <span className="badge bg-danger">Expired</span>;
  };

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
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 style={{ color: '#1a1a6e', fontWeight: 700 }}>
          {isAdmin ? "Ads History" : "My Ads"}
        </h1>
        {!isAdmin && (
          <button className="btn btn-primary" onClick={() => navigate("/Ads/Create")}>
            + Create Ad
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <select
          className="form-select w-auto"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Technology">Technology</option>
          <option value="Home & Kitchen">Home & Kitchen</option>
          <option value="Videogames">Videogames</option>
          <option value="Musical Instruments">Musical Instruments</option>
        </select>
      </div>

      {isLoading && <div className="text-center py-5">Loading...</div>}
      {!isLoading && adsList.length === 0 && (
        <div className="text-center py-5 text-muted">No ads found.</div>
      )}

      {/* Cards Grid */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {adsList.map((ad, index) => (
          <div className="col" key={index}>
            <div className="card h-100 shadow-sm" style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
              
              {/* Product Image */}
              <img
                src={ad.imageUrl || placeholderImage(ad.category)}
                alt={ad.title}
                style={{ width: '100%', height: 200, objectFit: 'cover' }}
                onError={(e) => { e.target.src = placeholderImage(ad.category); }}
              />

              <div className="card-body d-flex flex-column">
                {/* Title and Status */}
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="card-title mb-0" style={{ fontWeight: 600 }}>{ad.title}</h5>
                  {statusBadge(ad.status)}
                </div>

                {/* Category */}
                <p className="text-muted small mb-1">{ad.category}</p>

                {/* Price */}
                <p style={{ fontSize: 22, fontWeight: 700, color: '#e07b00' }}>${ad.price}</p>

                {/* Dates */}
                <p className="text-muted small mb-3">
                  {new Date(ad.startDate).toLocaleDateString()} → {new Date(ad.endDate).toLocaleDateString()}
                </p>

                {/* Action Buttons */}
                <div className="mt-auto d-flex flex-wrap gap-2">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => navigate(`/Ads/Details/${ad.id}`)}
                  >
                    Details
                  </button>

                  {!isAdmin && (
                    <>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/Ads/Edit/${ad.id}`)}
                        disabled={ad.status === "disabled"}
                      >
                        Edit
                      </button>

                      {(ad.status === "active" || ad.status === "expired") && (
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleDisable(ad.id)}
                        >
                          Disable
                        </button>
                      )}

                      {ad.status === "disabled" && (
                        <button className="btn btn-secondary btn-sm" disabled>
                          Disabled
                        </button>
                      )}
                    </>
                  )}

                  {isAdmin && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemove(ad.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ListMyAds;
