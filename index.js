import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import 'dotenv/config'

const app = express();
app.use(cors());
app.use(express.json());

const url = process.env.MONGO_URL;
const client = new MongoClient(url);

const collectionsToCheck = [
    "lessons",
    "orders",
    "users"
];

async function start() {
    await client.connect();
    const database = client.db("LearnEase");
    
    const existingCollections = await database.listCollections(
        {},
        { nameOnly: true}
    ).toArray();
    const existingCollectionNames = existingCollections.map(collection => collection.name)

    for (const name of collectionsToCheck) {
        if (!existingCollectionNames.includes(name.toLowerCase())) {
            await database.createCollection(name);
        }
    }
}

start();

app.listen(6969, () => {
    console.log("Server is running on port 6969");
})