import { MongoClient } from "mongodb";

const url = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@mongo:27017`;
const client = new MongoClient(url);

let connexion!: MongoClient;
try {
  connexion = await client.connect();
}
catch (error) {
  console.error(error);
}

const db = connexion.db("sharkoders");

export default db;