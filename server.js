const locationData = require("./locationData.json");
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
//const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;

const outfitData = {};
app.get("/select-outfit", (req, res) => {
  // ** Todo -> DB에 저장하고 불러올지 고민해봐야함 요청했을 때 테스트도 해봐야함.
  // DB에 있는 데이터를 꺼내서 프론트에서 일치하는지 확인해 봐야할 수 도 있음.
  console.log("이후경 통신성공");
  outfitData = req.data;
  return res.status(200).json({ message: "이후경 화이팅", data: outfitData });
});

app.get("/getoutfit", (req, res) => {
  return res.status(200).json({ message: "성공", data: outfitData });
});

app.get("/exchange", async (req, res) => {
  console.log("exchage 겟요청");
  let exchageObject = {};
  const getData = await axios.get(exchangeAPI, (err, res, body) => {
    const result = body;

    const xmlToJsona = convert.xml2json(result, {
      compact: true,
      spaces: 4,
    });
    return (exchageObject = xmlToJson);
  });
  const xmlToJson = convert.xml2js(getData.data, { compact: true, spaces: 4 });
  res.status(200).json({ message: "성공", data: xmlToJson });
});

app.get("/location", async (req, res) => {
  const result = {};
  const getData = await Promise.all(
    locationData.map(async ({ lat, lng }) => {
      const request = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${process.env.OPEN_WEATHER_KEY}`
      );
      return request.data;
    })
  );

  res.status(200).json({ message: "test", data: getData });
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
      .then((res) => (userData = res.data));

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
