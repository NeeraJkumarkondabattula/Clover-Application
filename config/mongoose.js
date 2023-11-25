import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DbConnection = async () => {
  try {
<<<<<<< HEAD
    const db = await mongoose.connect(process.env.mongodb, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
=======
    const db = await mongoose.connect(process.env.MongoURL,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,{
>>>>>>> 3892f5f11d990e121564d3beace4a654ffff907b
    console.log(`database connected: ${db.connection.host}`);
  } catch (err) {
    console.log(`Error ${err.message}`);
    process.exit(1);
  }
};

export default DbConnection;

//xU0bGXIJKoo1BbWL
