import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import axios from "axios";
import "./App.css";
import foodBankImage from "./images/food-bank.png";
import megaphoneImage from "./images/megaphone.png";
import hospitalImage from "./images/hospital.png";

const fetchRealTimeData = async (map, lat, lng) => {
  try {
    const response = await axios.get(
      `https://firms.modaps.eosdis.nasa.gov/api/fire-data?lat=${lat}&lon=${lng}&radius=50&api_key=${process.env.REACT_APP_NASA_API_KEY}`
    );

    const fireData = response.data;
    console.log("Fire Data Response:", fireData);

    // Ensure fireData is an array
    const fireDataArray = Array.isArray(fireData) ? fireData : fireData.fires || [];

    if (fireDataArray.length === 0) {
      console.warn("No fire data available for this location.");
      return;
    }

    // Convert the fire data into GeoJSON format
    const geoJson = {
      type: "FeatureCollection",
      features: fireDataArray.map((fire) => ({
        type: "Feature",
        properties: {
          dangerLevel: fire.dangerLevel || "moderate",
        },
        geometry: {
          type: "Point",
          coordinates: [fire.longitude, fire.latitude],
        },
      })),
    };

    map.data.addGeoJson(geoJson);

    map.data.setStyle((feature) => {
      const dangerLevel = feature.getProperty("dangerLevel");
    
      let color;
      if (dangerLevel === "high") {
        color = "red";
      } else if (dangerLevel === "moderate") {
        color = "orange";
      } else {
        color = "green"; // Default color for low/no danger
      }
    
      return {
        fillColor: color, // Color inside the overlay
        strokeColor: color, // Border color
        strokeWeight: 2, // Border thickness
        fillOpacity: 0.6, // Transparency of the fill
      };
    });
    

    map.data.addListener("click", (event) => {
      const dangerLevel = event.feature.getProperty("dangerLevel");
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div>Danger Level: ${dangerLevel}</div>`,
        position: event.latLng,
      });
      infoWindow.open(map);
    });
  } catch (error) {
    console.error("Error fetching real-time fire data:", error);
  }
};

function App() {
  const [showChatbox, setShowChatbox] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [thisLocation, setThisLocation] = useState("Vancouver");
  const [news, setNews] = useState([]); // State for storing news data
  const [openAiData, setOpenAiData] = useState(null);
  const [airQuality, setAirQuality] = useState(null); // State for Air Quality

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

  const toggleChatbox = () => {
    setShowChatbox(!showChatbox);
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    setMessages([...messages, { sender: "user", text: userInput }]);
    setUserInput("");

    try {
      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: userInput }),
      });

      const data = await response.json();
      if (data.response) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: data.response },
        ]);
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSearch = async (event) => {
    if (event.key === "Enter") {
      const location = event.target.value;
      setThisLocation(location);
      if (!location) return;
  
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            location
          )}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
  
        if (data.status === "OK" && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          const newCenter = { lat, lng };
  
          setCenter(newCenter);
          mapRef.current.panTo(newCenter); // Pan the map to the new location
  
          // Fetch real-time fire hazard data for the new location
          fetchRealTimeData(mapRef.current, lat, lng);
  
          callOpenAI(location);
          fetchAirQuality(lat, lng);
        } else {
          alert("Location not found. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        alert("Failed to search location. Please try again.");
      }
    }
  };  

  const callOpenAI = async (location) => {
    try {
      const response = await axios.post("http://localhost:3001/openai", {
        userMessage: location,
      });
      const responseString = response.data.data.slice(7, -3);
      const obj = JSON.parse(responseString);
      setOpenAiData(obj);
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
    }
  };

  const fetchAirQuality = async (lat, lng) => {
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`
      );
      const data = response.data;

      // Extract and format air quality information
      const airQualityIndex = data.list[0].main.aqi;
      const airQualityDescriptions = [
        "Good",
        "Fair",
        "Moderate",
        "Poor",
        "Very Poor",
      ];
      const airQualityText = airQualityDescriptions[airQualityIndex - 1];

      setAirQuality({
        index: airQualityIndex,
        description: airQualityText,
      });
    } catch (error) {
      console.error("Error fetching air quality data:", error);
      setAirQuality(null); // Reset on error
    }
  };

  const getColor = (scale) => {
    switch (scale) {
      case 1: return "green";    // Excellent
      case 2: return "lightgreen"; // Good
      case 3: return "yellow";   // Moderate
      case 4: return "orange";   // Poor
      case 5: return "red";      // Very Poor
      default: return "black";   // Default color
    }
  }

  useEffect(() => {
    if (!thisLocation) return;

    const fetchNews = async () => {
      const config = {
        method: "get",
        url: `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          `wildfire evacuation ${thisLocation}`
        )}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`,
        headers: {},
      };

      try {
        const response = await axios.request(config);
        const articles = response.data.articles || [];

        // Filter articles to ensure relevance (optional)
        const relevantArticles = articles.filter(
          (article) =>
            article.title.toLowerCase().includes("wildfire") ||
            article.description.toLowerCase().includes("evacuation")
        );

        setNews(relevantArticles); // Update state with filtered articles
      } catch (error) {
        console.error("Error fetching news data:", error);
        setNews([]); // Reset news data on error
      }
    };

    fetchNews();
  }, [thisLocation]);

  return (
    <div className="App">
      <div className="landing">
        <div className="landing-left-box">
          <h2 className="box-title">Embr Fires</h2>
          <span>
            All-in-one website to help you get ready for wildfires & evacuation
          </span>
        </div>
        <div>
          <div className="map-container">
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
              <div className="map-wrapper">
              <GoogleMap
            id="map"
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12}
            options={options}
            onLoad={(map) => {
              mapRef.current = map;
              fetchRealTimeData(center.lat, center.lng);
            }}
          >
            <MarkerF position={center} />
          </GoogleMap>
              </div>
            </LoadScript>
          </div>
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
  
      <div className="body">
        <div className="row row-two">
          {/* Air Quality Section */}
          <div className="big-card air style-border">
            <span className="box-title">Air Quality</span>
            <div className="score-box">
              {airQuality ? (
                <>
                  <span className="index box-title">{airQuality.index}</span>
                  <span className="index-description" style={{color: getColor(airQuality.index)}}>{airQuality.description}</span>
                  <div>
                    <p>Health Advisory</p>
                    <span>
                      {airQuality.description === "Good"
                        ? "Air quality is satisfactory. Outdoor activities are safe."
                        : "Consider limiting prolonged outdoor activities."}
                    </span>
                  </div>
                </>
              ) : (
                <p>Loading air quality data...</p>
              )}
            </div>
          </div>
  
          {/* News Section */}
          <div className="big-card news style-border">
            <span className="box-title">News & Media</span>
            <div className="news-card-wrapper">
              {news.length > 0 ? (
                news.map((article, index) => (
                  <div
                    key={index}
                    className="news-card style-border"
                    onClick={() => window.open(article.url, "_blank")}
                  >
                    <img src={article.urlToImage || megaphoneImage} alt="News" />
                    <div className="news-info">
                      <span>{article.title}</span>
                      <span>{article.description}</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No relevant news available for this location.</p>
              )}
            </div>
          </div>
        </div>
  
        {/* Food Banks Section */}
        <div className="row row-two">
          <div className="big-card food-bank style-border">
            <span className="box-title">Food Banks</span>
            <div className="small-card-wrapper">
              {openAiData &&
                openAiData.food_banks.map(
                  ({ name, address, phone_number, hours_of_operation }, index) => (
                    <div key={index} className="small-card style-border">
                      <span>{name}</span>
                      <img src={foodBankImage} alt="Food Bank" />
                      <span>{address}</span>
                      <span>{phone_number}</span>
                      <span>{hours_of_operation}</span>
                    </div>
                  )
                )}
            </div>
          </div>
        </div>
  
        {/* Hospitals Section */}
        <div className="row row-three">
          <div className="big-card hospital style-border">
            <span className="box-title">Hospitals & Shelters</span>
            <div className="small-card-wrapper hospital">
              {openAiData &&
                openAiData.hospitals_and_shelters.map(
                  ({ name, address, phone_number, hours_of_operation }, index) => (
                    <div key={index} className="small-card style-border">
                      <span>{name}</span>
                      <img src={hospitalImage} alt="Hospital" />
                      <span>{address}</span>
                      <span>{phone_number}</span>
                      <span>{hours_of_operation}</span>
                    </div>
                  )
                )}
            </div>
          </div>
        </div>
      </div>
  
      {/* Chatbot Section */}
      <div className="chat-icon" onClick={toggleChatbox}>
        💬
      </div>
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

