const express = require("express");
const { integrateData } = require("../utils/dataIntegration");

const router = express.Router();

// Endpoint for integrated data
router.get("/integrated-data", async (req, res) => {
  const { lat, lon, days = 1 } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }

  try {
    const data = await integrateData(parseFloat(lat), parseFloat(lon), parseInt(days, 10));
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching integrated data:", error.message);
    res.status(500).json({ error: "Failed to fetch integrated data" });
  }
});

module.exports = router;
