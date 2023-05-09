import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set("strictQuery", false);

// Define the database URL to connect to.
const mongoDB = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cms.pgicgf0.mongodb.net/`;

const connection = async function main() {
    const conn = await mongoose.connect(mongoDB);
    console.log("Connection to MongoDB successful");
    return conn;
};

export default connection;
