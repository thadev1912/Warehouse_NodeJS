
const mongoose = require('mongoose');
let connectDB = async (req, res) => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/mongodb');
    console.log('Connect MongoDB Completed!!.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}

module.exports = connectDB;
