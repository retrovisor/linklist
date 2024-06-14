import { MongoClient } from "mongodb";
import retry from "async-retry";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 50, // Set the maximum number of connections in the pool
  minPoolSize: 10, // Set the minimum number of connections in the pool
  maxIdleTimeMS: 30000, // Set the maximum idle time for a connection in milliseconds
};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = retry(
      async () => {
        await client.connect();
        return client;
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
      await client.connect();
      return client;
    },
    {
      retries: 3,
      minTimeout: 1000,
      maxTimeout: 5000,
    }
  );
}

export default clientPromise;
