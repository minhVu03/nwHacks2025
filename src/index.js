const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

// Load environment variables
dotenv.config();

const MAP_KEY = process.env.MAP_KEY; 
//const MAP_KEY = "a1dc556028f6ca4dd077e4e1ff893ff0";
console.log("Loaded MAP_KEY:", MAP_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const fireRoutes = require("./routes/fireRoutes");
const generalRoutes = require("./routes/generalRoutes");

app.use("/api/fires", fireRoutes);
app.use("/api", generalRoutes);

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
