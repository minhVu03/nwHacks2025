const axios = require("axios");
const { cleanCountryData, cleanFireData } = require("./parseCsv");

const BASE_URL = "https://firms.modaps.eosdis.nasa.gov/api";
const MAP_KEY = process.env.MAP_KEY;
//const MAP_KEY = "a1dc556028f6ca4dd077e4e1ff893ff0";

// Fetch and clean fire data by area
const getFireDataByArea = async (source, area, days) => {
  try {
    const url = `${BASE_URL}/area/csv/${MAP_KEY}/${source}/${area}/${days}`;
    console.log(`Requesting fire data by area: ${url}`);
    const response = await axios.get(url, { responseType: "text" });

    const cleanedData = cleanFireData(response.data);
    console.log("Cleaned Fire Data (Area):", cleanedData);

    return cleanedData;
  } catch (error) {
    console.error("Error fetching fire data by area:", error.message);
    if (error.response) {
      console.error("Response Status:", error.response.status);
      console.error("Response Data:", error.response.data);
    }
    throw new Error("Failed to fetch fire data by area");
  }
};

// Fetch and clean fire data by country
const getFireDataByCountry = async (source, country, days) => {
  try {
    const url = `${BASE_URL}/country/csv/${MAP_KEY}/${source}/${country}/${days}`;
    console.log(`Requesting fire data by country: ${url}`);
    const response = await axios.get(url, { responseType: "text" });

    const cleanedData = cleanFireData(response.data);
    console.log("Cleaned Fire Data (Country):", cleanedData);

    return cleanedData;
  } catch (error) {
    console.error("Error fetching fire data by country:", error.message);
    if (error.response) {
      console.error("Response Status:", error.response.status);
      console.error("Response Data:", error.response.data);
    }
    throw new Error("Failed to fetch fire data by country");
  }
};

// Fetch supported countries
const getCountries = async () => {
  try {
    const url = `${BASE_URL}/countries`;
    console.log(`Requesting countries data: ${url}`);
    const response = await axios.get(url, { responseType: "text" });

    const cleanedData = cleanCountryData(response.data);
    console.log("Cleaned Countries Data:", cleanedData);

    return cleanedData;
  } catch (error) {
    console.error("Error fetching countries:", error.message);
    if (error.response) {
      console.error("Response Status:", error.response.status);
      console.error("Response Data:", error.response.data);
    }
    throw new Error("Failed to fetch countries");
  }
};

// Fetch data availability
const getDataAvailability = async () => {
  try {
    const url = `${BASE_URL}/data_availability/csv/${MAP_KEY}/all`;
    console.log(`Requesting data availability: ${url}`);
    const response = await axios.get(url, { responseType: "text" });

    const cleanedData = cleanCountryData(response.data); // Reuse cleanCountryData for CSV parsing
    console.log("Cleaned Data Availability:", cleanedData);

    return cleanedData;
  } catch (error) {
    console.error("Error fetching data availability:", error.message);
    if (error.response) {
      console.error("Response Status:", error.response.status);
      console.error("Response Data:", error.response.data);
    }
    throw new Error("Failed to fetch data availability");
  }
};

module.exports = {
  getFireDataByArea,
  getFireDataByCountry,
  getCountries,
  getDataAvailability,
};
