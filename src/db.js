const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGODB_URI; // URI from .env file
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000, // Set timeout to 30 seconds
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
