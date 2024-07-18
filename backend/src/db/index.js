// src/db/index.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error While connecting to DB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
