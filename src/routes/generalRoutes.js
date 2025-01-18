const express = require("express");
const router = express.Router();
const { getCountries, getDataAvailability } = require("../utils/fetchFireData");

// Get supported countries
router.get("/countries", async (req, res) => {
  try {
    const data = await getCountries();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching countries:", error.message);
    res.status(500).json({ error: "Failed to fetch countries" });
  }
});

// Get data availability
router.get("/data-availability", async (req, res) => {
  try {
    const data = await getDataAvailability();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data availability:", error.message);
    res.status(500).json({ error: "Failed to fetch data availability" });
  }
});

module.exports = router;
