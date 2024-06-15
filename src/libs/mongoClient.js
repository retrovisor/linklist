import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 50,
  minPoolSize: 10,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
};

let client;
let clientPromise;

const connect = async () => {
  try {
    client = new MongoClient(uri, options);
    await client.connect();
    console.log("Connected to MongoDB");
    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = connect();
}

// Attempt to reconnect if there is an error or the connection is lost
client.on("error", async (error) => {
  console.error("MongoDB connection error:", error);
  try {
    await client.close();
  } catch (closeError) {
    console.error("Error closing MongoDB connection:", closeError);
  }
  clientPromise = connect();
});

client.on("close", async () => {
  console.warn("MongoDB connection closed. Attempting to reconnect...");
  clientPromise = connect();
});

export default clientPromise;
