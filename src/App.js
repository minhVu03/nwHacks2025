import React, { useState, useRef } from "react";
import { GoogleMap, LoadScript, MarkerF, StandaloneSearchBox } from "@react-google-maps/api";
import './App.css';

function App() {
  const [center, setCenter] = useState({
    lat: 37.7749, 
    lng: -122.4194,
  });
  const mapRef = useRef();
  const searchBoxRef = useRef();

  const mapContainerStyle = {
    width: "100%", 
    height: "400px", 
  };

  const options = {
    zoomControl: true,
    mapTypeControl: false, // Disable the Map/Satellite toggle
    streetViewControl: false,
    rotateControl: true,
    fullscreenControl: false,
    scaleControl: false, // Optional: disable scale control
  };

  const onSearchBoxLoad = (ref) => {
    searchBoxRef.current = ref;
  };

  const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places.length === 0) return;

    const place = places[0];
    const newCenter = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    setCenter(newCenter);
    mapRef.current.panTo(newCenter); 
  };

  // Handle enter key press to trigger search
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onPlacesChanged();
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
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={["places"]}>
              <div className="map-wrapper"> 
                <GoogleMap
                  id="map" /* Ensure the id is here */
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={12}
                  options={options}
                  onLoad={(map) => (mapRef.current = map)}
                >
                  <MarkerF position={center} />
                  <StandaloneSearchBox
                    onLoad={onSearchBoxLoad}
                    onPlacesChanged={onPlacesChanged}
                  >
                    <input
                      type="text"
                      placeholder="Search Location"
                      className="search-box-input" 
                      onKeyPress={handleKeyPress}  /* Listen for Enter key press */
                    />
                  </StandaloneSearchBox>
                </GoogleMap>
              </div>
            </LoadScript>
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
