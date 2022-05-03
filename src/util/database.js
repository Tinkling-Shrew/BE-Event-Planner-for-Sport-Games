import mongoose from "mongoose";
import "dotenv/config";

const MONGO_HOSTNAME = process.env.DB_HOSTNAME || "127.0.0.1";
const MONGO_PORT = process.env.DB_PORT || "27017";
const MONGO_PATH = process.env.DB_PATH || "test";
const MONGO_USER = process.env.DB_USER || null;
const MONGO_PASSWORD = process.env.DB_PASSWORD || null;

const dbURL = MONGO_USER && MONGO_PASSWORD ? `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_PATH}` : `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_PATH}`;

export class Database {
    connect() {
        mongoose.connect(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    async disconnect() {
        await mongoose.disconnect();
    }
}