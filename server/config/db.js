import mongoose from 'mongoose';
import { colours } from '../constants/constants.js';

const connectDB = async () => {
  try {
    const connectionURI =
      process.env.NODE_ENV === 'development'
        ? process.env.MONGO_URI_LOCAL
        : process.env.MONGO_URI;

    mongoose.set('strictQuery', false); // Optional in newer versions

    const conn = await mongoose.connect(connectionURI);

    console.log(colours.fg.green, `MongoDB Connected: ${conn.connection.name}`);
  } catch (error) {
    console.log(colours.fg.red, `Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
