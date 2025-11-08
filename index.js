import express from "express";
import cors from "cors"
import { MongoClient, ObjectId } from "mongodb";
require("dotenv").config();

const app = express()
app.use(cors())
app.use(express.json())

const url = process.env.MONGO_URL
const client = new MongoClient(url)