const express = require("express");
const convert = require("xml-js");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const axios = require("axios");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
const logger = require("morgan");
const xmlParser = require("express-xml-bodyparser");

app.use(cors());
app.use(logger("combined"));
app.use(xmlParser());
dotenv.config();

var db;
let userId = {};

MongoClient.connect(
  `mongodb+srv://${process.env.MONGODB_KEY}@cluster0.hl7ifoa.mongodb.net/?retryWrites=true&w=majority`,
  (err, client) => {
    if (err) return console.log(연결오류);
    app.listen(3001, () => {
      console.log("서버");
    });
    db = client.db("bacharta");
  }
);

const date = new Date();
const fullDay = `${date.getFullYear()}${
  date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
}${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;

const exchangeAPI = `https://unipass.customs.go.kr:38010/ext/rest/trifFxrtInfoQry/retrieveTrifFxrtInfo?crkyCn=${process.env.EXCHANGE_KEY}&qryYymmDd=${fullDay}&imexTp=2`;

app.get("/", async (req, res) => {
  let exchageObject = {};
  const a = await axios.get(exchangeAPI, (err, res, body) => {
    const result = body;
    console.log(123);
    const xmlToJsona = convert.xml2json(result, {
      compact: true,
      spaces: 4,
    });
    return (exchageObject = xmlToJson);
  });
  const xmlToJson = convert.xml2js(a.data, { compact: true, spaces: 4 });
  res.status(200).json({ message: "성공", data: xmlToJson });
});
app.get(`/user/sign`, async (req, res) => {
  try {
    console.log(req.headers.authorization);
    const token = req.headers.authorization;
    let userData = {};
    await axios
      .get("https://kapi.kakao.com/v2/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => (userData = res.data)); //전의 코드는 res.data를 userId에 담았음.

    const kakaoPk = userData.id;

    let userRow = await db.collection("bacharta").findOne({ kakaoPk: kakaoPk });

    if (!userRow) {
      userRow = await db
        .collection("bacharta")
        .insertOne({ kakaoPk: kakaoPk })
        .then(() => console.log("저장완료했습니다"));
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
      .json({ message: "Login Success" });
  } catch (err) {
    console.log(err.response.status);
    res.status(400).json({ message: "연결에러입니다." });
  }
});
