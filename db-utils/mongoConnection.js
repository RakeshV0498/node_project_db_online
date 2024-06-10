import { MongoClient } from "mongodb";

import dotenv from "dotenv";

dotenv.config();

const dbCluster = process.env.DB_CLUSTER || "";

const dbName = process.env.DB_NAME || "";

const dbUserName = process.env.DB_USER || "";

const dbPassword = process.env.DB_PASSWORD || "";

const cloudURI = `mongodb+srv://${dbUserName}:${dbPassword}@${dbCluster}/${dbName}?retryWrites=true&w=majority&appName=rakeshCluster`;

const client = new MongoClient(cloudURI);

const db = client.db("node_day_3");

const connectToDb = async () => {
  try {
    await client.connect();
    console.log("Db connected successfully");
  } catch (error) {
    console.error(error);
  }
};

export { client, db };

export default connectToDb;
