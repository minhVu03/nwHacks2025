const { getWeatherData, getAirQualityData } = require("./fetchWeatherData");
const { getFireDataByArea } = require("./fetchFireData");
const IntegratedData = require("../models/IntegratedData");

const EARTH_RADIUS_KM = 6371; // Earth's radius in kilometers

// Helper function to calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (deg) => (deg * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
};

// Function to integrate data and save it in MongoDB
const integrateData = async (lat, lon, days = 1) => {
  try {
    const weatherPromise = getWeatherData(lat, lon);
    const airQualityPromise = getAirQualityData(lat, lon);
    const firePromise = getFireDataByArea("VIIRS_NOAA20_NRT", "world", days);

    const [weather, airQuality, fireData] = await Promise.all([
      weatherPromise,
      airQualityPromise,
      firePromise,
    ]);

    const distanceRadius = 150; // Test with 150 km radius

    // Filter fires within the distance radius
    const relevantFires = fireData.filter((fire) => {
      const fireLat = fire.latitude;
      const fireLon = fire.longitude;
      const distance = calculateDistance(lat, lon, fireLat, fireLon);
      return distance <= distanceRadius;
    });

    // Create the Integrated Data document
    const integratedData = {
      location: { latitude: lat, longitude: lon },
      weather,
      airQuality,
      fires: relevantFires,
    };

    // Insert into MongoDB
    const newData = new IntegratedData(integratedData);
    await newData.save(); // Save data to the collection
    console.log("Integrated data saved to MongoDB");

    return {
      location: { latitude: lat, longitude: lon },
      weather,
      airQuality,
      fires: relevantFires,
    };
  } catch (error) {
    console.error("Error integrating data:", error.message);
    throw new Error("Failed to integrate data");
  }
};

module.exports = { integrateData };
