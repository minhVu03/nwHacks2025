const axios = require("axios");
const xml2js = require("xml2js");

// GDACS RSS Feed URL
const GDACS_RSS_URL = "https://www.gdacs.org/xml/rss.xml";

const getGdacsRssData = async (filterByFire = false) => {
  try {
    console.log("Fetching GDACS RSS feed...");

    // Fetch the RSS feed
    const response = await axios.get(GDACS_RSS_URL);

    // Parse the XML into JSON
    const parser = new xml2js.Parser({ explicitArray: false });
    const parsedData = await parser.parseStringPromise(response.data);

    // Extract the `item` array from the RSS feed
    const items = Array.isArray(parsedData.rss.channel.item)
      ? parsedData.rss.channel.item
      : [parsedData.rss.channel.item]; // Handle single-item arrays

    // Clean and format the data
    let cleanedData = items.map((item) => ({
      title: item.title,
      description: item.description,
      link: item.link,
      pubDate: item.pubDate,
      eventType: item["gdacs:eventtype"], // Event type (e.g., WF for wildfires)
      alertLevel: item["gdacs:alertlevel"], // Alert level (e.g., Green, Orange, Red)
      coordinates: item["geo:Point"]
        ? {
            latitude: parseFloat(item["geo:Point"]["geo:lat"]),
            longitude: parseFloat(item["geo:Point"]["geo:long"]),
          }
        : null,
      country: item["gdacs:country"], // Country affected
      severity: item["gdacs:severity"]?.["$"]?.value, // Severity level
      populationAffected: item["gdacs:population"]?.["$"]?.value, // Population affected
    }));

    // If filtering for fires, keep only items with eventType WF
    if (filterByFire) {
      cleanedData = cleanedData.filter((item) => item.eventType === "WF");
    }

    return cleanedData;
  } catch (error) {
    console.error("Error fetching GDACS RSS feed:", error.message);
    throw new Error("Failed to fetch GDACS RSS data");
  }
};

module.exports = {
  getGdacsRssData,
};
