
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // We use the MONGO_URI from our .env file
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options are to prevent deprecation warnings
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit the process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
