import { MongoClient } from "mongodb";
import retry from "async-retry";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 50,
  minPoolSize: 10,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000, // Increase the server selection timeout
  socketTimeoutMS: 45000, // Increase the socket timeout
  connectTimeoutMS: 30000, // Increase the connection timeout
};

const retryOptions = {
  retries: 5, // Number of retry attempts
  minTimeout: 1000, // Minimum delay between retries (in ms)
  maxTimeout: 5000, // Maximum delay between retries (in ms)
  factor: 2, // Exponential backoff factor
};

let client;
let clientPromise;

const connect = async () => {
  try {
    await retry(async () => {
      await client.connect();
    }, retryOptions);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = connect();
}

export default clientPromise;
