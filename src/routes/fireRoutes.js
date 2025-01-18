const express = require("express");
const router = express.Router();
const { getFireDataByArea, getFireDataByCountry } = require("../utils/fetchFireData");

// Route: Fire data by area
router.get("/area", async (req, res) => {
  try {
    const { source, area, days } = req.query;
    if (!source || !area || !days) {
      return res.status(400).json({ error: "Missing required query parameters: source, area, days" });
    }

    const data = await getFireDataByArea(source, area, days);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in /area route:", error.message);
    res.status(500).json({ error: "Failed to fetch fire data by area" });
  }
});

// Route: Fire data by country
router.get("/country", async (req, res) => {
  try {
    const { source, country, days } = req.query;
    if (!source || !country || !days) {
      return res.status(400).json({ error: "Missing required query parameters: source, country, days" });
    }

    const data = await getFireDataByCountry(source, country, days);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in /country route:", error.message);
    res.status(500).json({ error: "Failed to fetch fire data by country" });
  }
});

module.exports = router;
