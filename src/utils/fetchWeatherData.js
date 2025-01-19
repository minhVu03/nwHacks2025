const axios = require("axios");

// Base URL for OpenWeatherMap API
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Fetch weather data by latitude and longitude
const getWeatherData = async (lat, lon) => {
  const API_KEY = process.env.OPENWEATHER_API_KEY; // Use the API key from .env file
  if (!API_KEY) {
    throw new Error("API Key is not defined. Please check your environment variables.");
  }

  try {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    console.log(`Fetching weather data from: ${url}`);
    const response = await axios.get(url);

    // Extract relevant weather information
    const weather = response.data;
    return {
      location: weather.name || "Unknown Location",
      temperature: weather.main.temp,
      feels_like: weather.main.feels_like,
      humidity: weather.main.humidity,
      weather_description: weather.weather[0].description,
      wind_speed: weather.wind.speed,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    throw new Error("Failed to fetch weather data");
  }
};

// Fetch air quality data by latitude and longitude
const getAirQualityData = async (lat, lon) => {
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  if (!API_KEY) {
    throw new Error("API Key is not defined. Please check your environment variables.");
  }

  try {
    const url = `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    console.log(`Fetching air quality data from: ${url}`);
    const response = await axios.get(url);

    // Extract relevant air quality information
    const airQuality = response.data.list[0];
    return {
      aqi: airQuality.main.aqi,
      pollutants: {
        co: airQuality.components.co,
        no: airQuality.components.no,
        no2: airQuality.components.no2,
        o3: airQuality.components.o3,
        so2: airQuality.components.so2,
        pm2_5: airQuality.components.pm2_5,
        pm10: airQuality.components.pm10,
        nh3: airQuality.components.nh3,
      },
    };
  } catch (error) {
    console.error("Error fetching air quality data:", error.message);
    throw new Error("Failed to fetch air quality data");
  }
};

module.exports = {
  getWeatherData,
  getAirQualityData,
};
