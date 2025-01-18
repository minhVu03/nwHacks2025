const express = require("express");
const { getGdacsRssData } = require("../utils/fetchGdacsRss");
const router = express.Router();

// Endpoint to fetch GDACS RSS data
router.get("/gdacs/rss", async (req, res) => {
  const { type } = req.query; // Check for type parameter

  try {
    // Filter by fire if type is 'fire'
    const filterByFire = type === "fire";
    const data = await getGdacsRssData(filterByFire);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching GDACS RSS data:", error.message);
    res.status(500).json({ error: "Failed to fetch GDACS RSS data" });
  }
});

module.exports = router;
