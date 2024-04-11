// mongoConnection.js
const { MongoClient } = require("mongodb");

const connectMongoDB = async () => {
  const mongo_usr = "Carlos";
  const mongo_pwd = "holabuenas";
  const db_name = "clothes";
  const mongo_uri = "cluster0.slujba9.mongodb.net";

  if (!mongo_usr || !mongo_pwd || !db_name || !mongo_uri) {
    throw new Error(
      "Missing environment variables, check env.sample for creating .env file"
    );
  }

  const mongo_url = `mongodb+srv://${mongo_usr}:${mongo_pwd}@${mongo_uri}/${db_name}?authMechanism=SCRAM-SHA-1`;

  const client = new MongoClient(mongo_url);

  try {
    await client.connect();
    const db = client.db(db_name);

    await db.createCollection("PRODUCTOS");

    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

module.exports = { connectMongoDB };
