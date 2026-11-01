// config/db.js
// Establishes the connection to MongoDB using Mongoose.
// Uses DNS IPv4 prioritization and a 5-second connection timeout for fast failover.

const dns = require("dns");
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/notespace";

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error(
      "👉 Ensure MongoDB is running locally on port 27017 or provide a valid MONGO_URI in .env"
    );
    process.exit(1);
  }
};

module.exports = connectDB;
