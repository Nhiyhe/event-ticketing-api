const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

module.exports = async function () {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, { dbName: "events" });
  console.log(`Database connected successfully to ${mongoUri}`);
};
