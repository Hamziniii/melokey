import { connect } from "mongoose";

import dotenv from "dotenv"
dotenv.config()

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

export const getDB = async () => {
  return await connect(uri, {
    dbName: "melokey",
  });
};