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
let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = retry(
      async () => {
        try {
          await client.connect();
          console.log("Connected to MongoDB");
          return client;
        } catch (error) {
          console.error("Error connecting to MongoDB:", error);
          throw error;
        }
      },
      {
        retries: 3,
        minTimeout: 1000,
        maxTimeout: 5000,
      }
    );
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = retry(
    async () => {
      try {
        await client.connect();
        console.log("Connected to MongoDB");
        return client;
      } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
      }
    },
    {
      retries: 3,
      minTimeout: 1000,
      maxTimeout: 5000,
    }
  );
}

export default clientPromise;
