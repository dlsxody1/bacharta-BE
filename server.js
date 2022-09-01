const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const axios = require("axios");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
app.use(cors());
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

app.get(`/user/sign`, async (req, res) => {
  const token = req.headers.authorization;
  let userData = {};
  console.log(token);
  await axios
    .get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => (userData = res.data))
    .catch((err) => console.log(err));
  const kakaoPk = userData.id;
  let userRow = await db.collection("bacharta").findOne({ kakaoPk: kakaoPk });

  if (!userRow) {
    userRow = db.collection("bacharta").insertOne({ kakaoPk: kakaoPk });
  }
  const serviceToken = jwt.sign(
    {
      userNickname: userData.properties.nickname,
    },
    process.env.SECRET_KEY
  );

  return res
    .header("Authorization", serviceToken)
    .status(200)
    .json({ message: "Success" });
});
