const Papa = require("papaparse");

// Clean and format country-related data
const cleanCountryData = (csvData) => {
  console.log("Raw CSV Data (Countries):", csvData);

  const parsed = Papa.parse(csvData, { header: true });
  console.log("Parsed CSV Data (Countries):", parsed.data);

  return parsed.data.map((row) => ({
    id: row.id,
    abbreviation: row.abreviation,
    name: row.name,
    extent: row.extent,
  }));
};

// Clean and format fire-related data
const cleanFireData = (csvData) => {
  console.log("Raw CSV Data (Fires):", csvData);

  const parsed = Papa.parse(csvData, { header: true });
  console.log("Parsed CSV Data (Fires):", parsed.data);

  const cleanedData = parsed.data.map((row) => ({
    latitude: parseFloat(row.latitude),
    longitude: parseFloat(row.longitude),
    brightness: parseFloat(row.bright_ti4),
    scan: parseFloat(row.scan),
    track: parseFloat(row.track),
    acquisition_date: row.acq_date,
    acquisition_time: row.acq_time,
    satellite: row.satellite,
    instrument: row.instrument,
    confidence: row.confidence,
    fire_radiative_power: parseFloat(row.frp),
    daynight: row.daynight,
  }));

  // Filter out rows with missing or invalid data
  return cleanedData.filter(
    (row) =>
      row.latitude &&
      row.longitude &&
      !isNaN(row.brightness) &&
      row.acquisition_date
  );
};

module.exports = {
  cleanCountryData,
  cleanFireData,
};
