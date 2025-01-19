const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectDB = require("./db"); 


// Load environment variables
dotenv.config();

const MAP_KEY = process.env.MAP_KEY; 
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
const fireRoutes = require("./routes/fireRoutes");
const generalRoutes = require("./routes/generalRoutes");
const gdacsRoutes = require("./routes/gdacsRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const integrationRoutes = require("./routes/integrationRoutes");
const integratedDataRoutes = require("./routes/integratedDataRoutes");

app.use("/api/fires", fireRoutes);
app.use("/api", generalRoutes);
app.use("/api", gdacsRoutes);
app.use("/api", weatherRoutes);
app.use("/api", integrationRoutes);
app.use("/api", integratedDataRoutes);


// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
