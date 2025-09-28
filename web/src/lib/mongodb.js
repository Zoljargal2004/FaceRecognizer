import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // add in .env.local
const options = {};

let client
let clientPromise

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // In dev mode, use a global variable so we don’t create new client every reload
  if (!(global )._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global )._mongoClientPromise = client.connect();
  }
  clientPromise = (global )._mongoClientPromise;
} else {
  // In prod mode, just create one
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
