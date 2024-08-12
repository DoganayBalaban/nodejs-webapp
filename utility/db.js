const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (c) => {
  MongoClient.connect(
    "mongodb+srv://dbalaban1907:MwMHX0SS4SVeqmOf@cluster0.rabq3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
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
