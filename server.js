const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const axios = require("axios");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
app.use(cors);
dotenv.config();

var db;
let userId = {};

MongoClient.connect(
  `mongodb+srv://${process.env.MONGODB_KEY}@cluster0.hl7ifoa.mongodb.net/?retryWrites=true&w=majority`,
  (err, client) => {
    if (err) return console.log(process.env.MONGODB_KEY);
    db = client.db("bacharta");
    app.listen(3001, () => {
      console.log("서버가동");
    });
  }
);

let token = {};
app.post(`http://127.0.0.1:3001/user/sign`, async (req, res) => {
  await axios
    .post("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((userId = res.data))
    .then(console.log(userId))
    .then();
  const findUser = db.collection("bacharta").findOne({ kakaoPk: userId });
  if (!findUser) return userId;
  db.collection("bacharta").insertOne({ kakaoPk: userId }, () => {
    console.log("저장완료");

    return res
      .header("Authorization", token)
      .status(200)
      .json({ message: "Success" });
  });

  //const kakaoToken = 1;
  //const token = jwt.sign({});
});
