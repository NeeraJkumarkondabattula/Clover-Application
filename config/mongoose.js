import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DbConnection = async () => {
  try {
    const db = await mongoose.connect(process.env.MongoURL, {});
    console.log(`database connected: ${db.connection.host}`);
  } catch (err) {
    console.log(`Error ${err.message}`);
    process.exit(1);
  }
};

export default DbConnection;

//xU0bGXIJKoo1BbWL
