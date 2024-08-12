const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
require("dotenv").config();
let _db;

const mongoConnect = (c) => {
  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      console.log("Connected");
      _db = client.db();
      c();
    })
    .catch((err) => {
      console.log("err :>> ", err);
    });
};

const getdb = () => {
  if (_db) {
    return _db;
  }
  throw new Error("No database found");
};
exports.mongoConnect = mongoConnect; // export the function
exports.getdb = getdb; // export the function
