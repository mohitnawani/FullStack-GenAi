const express = require('express');
const connectDB = require('./src/config/db');
const app = express();


const intialconnection = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected');

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}
intialconnection();


