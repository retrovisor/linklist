import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
let client;

const connect = async () => {
  if (!client || !client.isConnected()) {
    try {
      client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      // Handle the error gracefully, e.g., return an error response
      throw new Error("Failed to connect to MongoDB");
    }
  }
  return client;
};

let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = connect();
}

export default clientPromise;
