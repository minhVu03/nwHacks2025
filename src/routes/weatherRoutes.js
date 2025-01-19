const express = require("express");
const { getWeatherData, getAirQualityData } = require("../utils/fetchWeatherData");
const router = express.Router();

// Endpoint to fetch weather data
router.get("/weather", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }

  try {
    const weatherData = await getWeatherData(lat, lon);
    res.status(200).json(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// Endpoint to fetch air quality data
router.get("/air-quality", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }

  try {
    const airQualityData = await getAirQualityData(lat, lon);
    res.status(200).json(airQualityData);
  } catch (error) {
    console.error("Error fetching air quality data:", error.message);
    res.status(500).json({ error: "Failed to fetch air quality data" });
  }
});

// Endpoint to fetch both weather and air quality data
router.get("/weather-and-air-quality", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }

  try {
    const [weatherData, airQualityData] = await Promise.all([
      getWeatherData(lat, lon),
      getAirQualityData(lat, lon),
    ]);

    res.status(200).json({
      weather: weatherData,
      air_quality: airQualityData,
    });
  } catch (error) {
    console.error("Error fetching combined data:", error.message);
    res.status(500).json({ error: "Failed to fetch combined data" });
  }
});

module.exports = router;
