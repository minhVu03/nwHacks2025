import React, { useState, useRef } from "react";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import './App.css';
import foodBankImage from './images/food-bank.png';
import megaphoneImage from './images/megaphone.png';

function App() {
  const [showChatbox, setShowChatbox] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const toggleChatbox = () => {
    setShowChatbox(!showChatbox);
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    setMessages([...messages, { sender: 'user', text: userInput }]);
    setUserInput('');

    try {
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: userInput }),
      });

      const data = await response.json();
      if (data.response) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: data.response },
        ]);
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
      {/* Landing Section */}
      <div className="landing">
        <div className="landing-left-box">
          <h2>Fire Warrior</h2>
          <span>
            All in 1 website to help you get ready for wildfires & evacuation
          </span>
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
        <div className="row row-two">
          <div className="big-card air style-border">
            <span className="box-title">Air Quality</span>
            <div className="score-box">
              <span>43</span>
              <span>Good</span>
              <div>
                <p>Health Advisory</p>
                <span>
                  Air quality is satisfactory. Outdoor activities are safe.
                </span>
              </div>
            </div>
          </div>
          <div className="big-card news style-border">
            <span className="box-title">News & Media</span>
            <div className="news-card-wrapper">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="news-card style-border">
                  <img src={megaphoneImage} alt="News" />
                  <div className="news-info">
                    <span>title</span>
                    <span>desc</span>
                    <span>date</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="row row-two">
          <div className="big-card food-bank style-border">
            <span className="box-title">Food Banks</span>
            <div className="small-card-wrapper">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="small-card style-border">
                  <span>Kamloops Food Bank</span>
                  <img src={foodBankImage} alt="Food Bank" />
                  <span>
                    Address: 171 Wilson St, Kamloops, BC V2B 2M4, Canada
                  </span>
                  <span>Phone: +1 250-376-2252</span>
                  <span>Hours: Mon-Fri: 8:00 AM - 2:00 PM</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="row row-three">
          <div className="big-card hospital style-border">
            <span className="box-title">Hospitals & Shelters</span>
            <div className="small-card-wrapper hospital">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="small-card style-border">
                  <span>Kamloops Food Bank</span>
                  <img src={foodBankImage} alt="Food Bank" />
                  <span>
                    Address: 171 Wilson St, Kamloops, BC V2B 2M4, Canada
                  </span>
                  <span>Phone: +1 250-376-2252</span>
                  <span>Hours: Mon-Fri: 8:00 AM - 2:00 PM</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="row row-four style-border">
          <div>
            <span>checklist</span>
          </div>
        </div>
      </div>
      {/* Chatbot Icon */}
      <div className="chat-icon" onClick={toggleChatbox}>
        💬
      </div>

      {/* Chatbox */}
      {showChatbox && (
        <div className="chatbox">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default App;
