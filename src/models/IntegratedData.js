const mongoose = require("mongoose");

const integratedDataSchema = new mongoose.Schema({
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  weather: {
    location: { type: String },
    temperature: { type: Number },
    feels_like: { type: Number },
    humidity: { type: Number },
    weather_description: { type: String },
    wind_speed: { type: Number },
  },
  airQuality: {
    aqi: { type: Number },
    pollutants: {
      co: { type: Number },
      no: { type: Number },
      no2: { type: Number },
      o3: { type: Number },
      so2: { type: Number },
      pm2_5: { type: Number },
      pm10: { type: Number },
      nh3: { type: Number },
    },
  },
  fires: [
    {
      latitude: { type: Number },
      longitude: { type: Number },
      brightness: { type: Number },
      acquisition_date: { type: String },
      fire_radiative_power: { type: Number },
    },
  ],
});

module.exports = mongoose.model("IntegratedData", integratedDataSchema);
