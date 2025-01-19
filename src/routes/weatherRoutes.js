const express = require("express");
const { getWeatherData } = require("../utils/fetchWeatherData");
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

module.exports = router;
