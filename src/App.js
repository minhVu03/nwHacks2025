import React, { useState, useRef } from "react";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import './App.css';

function App() {
  const [center, setCenter] = useState({
    lat: 37.7749, 
    lng: -122.4194,
  });
  const mapRef = useRef();

  const mapContainerStyle = {
    width: "100%", 
    height: "400px", 
  };

  const options = {
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    rotateControl: true,
    fullscreenControl: false,
    scaleControl: false,
  };

  // Handle location search
  const handleSearch = async (event) => {
    if (event.key === "Enter") {
      const location = event.target.value;
      if (!location) return;

      try {
        // Fetch coordinates using Geocoding API
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          const newCenter = { lat, lng };

          setCenter(newCenter);
          mapRef.current.panTo(newCenter); // Pan the map to the new location
        } else {
          alert("Location not found. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        alert("Failed to search location. Please try again.");
      }
    }
  };

  return (
    <div className="App">
      <div className="landing">
        <div className="landing-left-box"> 
          <h2>Fire Warrior</h2>
          <span>All in 1 website to help you get ready for wildfires & evacuation</span>
        </div>
        <div>
          {/* Google Map */}
          <div className="map-container">
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
              <div className="map-wrapper"> 
                <GoogleMap
                  id="map"
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={12}
                  options={options}
                  onLoad={(map) => (mapRef.current = map)}
                >
                  <MarkerF position={center} />
                </GoogleMap>
              </div>
            </LoadScript>
          </div>  
          {/* Search Box */}
          <div className="search-box-container">
            <input
              type="text"
              placeholder="Enter a location and press Enter"
              className="search-box-input"
              onKeyDown={handleSearch}
            />
          </div>        
        </div>
      </div>

      {/* Body Section */}
      <div className="body">
        <div className="row row-one">
          <div className="big-card style-border">
            <p className="box-title">Air Quality</p>
          </div>
          <div className="big-card style-border">
            <p className="box-title">News & Media</p>
          </div>
        </div>
        <div className="row row-two style-border">
          <div className="big-card style-border">
            <span className="box-title">Food Banks</span>
            <div className="small-card style-border">
              <span>title</span>
              <span>Address</span>
              <span>Phone</span>
              <span>Hour</span>
            </div>
            <div className="small-card style-border">
              <span>title</span>
              <span>Address</span>
              <span>Phone</span>
              <span>Hour</span>
            </div>
          </div>
          <div className="big-card style-border">
            <span className="box-title">Hospitals & Shelters</span>
          </div>
        </div>
        <div className="row row-three style-border">
          <div>
            <span>checklist</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
