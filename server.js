const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
var db;
MongoClient.connect(
  `mongodb+srv://${process.env.MONGODB_KEY}@cluster0.hl7ifoa.mongodb.net/?retryWrites=true&w=majority`,
  (err, client) => {
    if (err) return console.log(err);
    db = client.db("bacharta");
    app.listen(3000, () => {
      console.log("d1d");
      console.log(process.env.MONGODB_KEY);
    });
  }
);

app.get("/app", (req, res) => {
  db.collection("bacharta").insertOne({ kakaoPk: 20 }, () => {
    console.log("저장완료");
  });
});
