const locationData = require("./locationData.json");
const atmosphereNumber = require("./atmosphere.json");
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
  date.getMonth() > 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
}${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;

//const exchangeAPI = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${process.env.EXCHANGE_KEY}&searchdate=20220104&data=AP01`;

const exchangeAPI = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${process.env.EXCHANGE_KEY}&searchdate=${fullDay}&data=AP01`;
const atmosphereAPI = `http://apis.data.go.kr/1480523/MetalMeasuringResultService/MetalService?numOfRows=1&pageNo=1&resultType=xml&stationcode=1&date=${fullDay}&timecode=RH02&itemcode=90303&serviceKey=${process.env.ATMOSPHERE_KEY}`;
const covidAPI = `http://apis.data.go.kr/1790387/covid19CurrentStatusHospitalizations/covid19CurrentStatusHospitalizationsJson?serviceKey=${process.env.COVID_KEY}`;
const crimeAPI = "http://api.sexoffender.go.kr/openapi/SOCitysStats/";

app.get("/crime", async (req, res) => {
  const getData = await axios.get(crimeAPI, (err, res, body) => {
    const result = body;
    const xmlToJson = convert.xml2js(result, {
      compact: true,
      spaces: 4,
    });
    return xmlToJson;
  });
  const xmlToJson = convert.xml2js(getData.data, { compact: true, spaces: 4 });
  return res.status(200).json({ data: xmlToJson });
});
app.post("/select-outfit", (req, res) => {
  // ** Todo -> DB에 저장하고 불러올지 고민해봐야함 요청했을 때 테스트도 해봐야함.
  // DB에 있는 데이터를 꺼내서 프론트에서 일치하는지 확인해 봐야할 수 도 있음.
  console.log(req.body, "바디");
  // db.collection("outfit").insertOne(req);

  return res.status(200).json({ message: "이후경 화이팅", data: req });
});

app.get("/covid", async (req, res) => {
  const getData = await axios.get(covidAPI);

  return res.status(200).json({
    message: "covid data 통신 성공",
    data: getData.data.response.result,
  });
});

app.get("/getoutfit/:userToken", (req, res) => {
  let { userToken } = req.params;
  let checkUser = db.collection("outfit").findOne({ userToken: userToken });
  const userOutfit = {};
  if (checkUser) {
    userOutfit = checkUser;
  } else {
    userOutfit.message = "outfit data가 없습니다";
  }

  return res.status(200).json({ message: "성공", data: userOutfit });
});

app.get("/exchange", async (req, res) => {
  console.log("exchage 겟요청");
  let exchageData = {};
  const getData = await axios.get(exchangeAPI);

  res.status(200).json({ message: "성공", data: getData.data });
});

app.get("/atmosphere/:location", async (req, res) => {
  let atmosphereObject = {};
  let { location } = req.params;

  const getData = await axios.get(
    `http://apis.data.go.kr/1480523/MetalMeasuringResultService/MetalService?numOfRows=1&pageNo=1&resultType=xml&stationcode=${location}&date=${fullDay}&timecode=RH02&itemcode=90303&serviceKey=${process.env.ATMOSPHERE_KEY}`,
    (err, res, body) => {
      const result = body;
      const xmlToJson = convert.xml2js(result, {
        compact: true,
        spaces: 4,
      });
      return (atmosphereObject = xmlToJson);
    }
  );

  const xmlToJson = convert.xml2js(getData.data, { compact: true, spaces: 4 });
  console.log(xmlToJson);
  res.status(200).json({ message: "성공", data: xmlToJson });
});

app.get("/location", async (req, res) => {
  const getData = await Promise.all(
    locationData.map(async ({ lat, lng }) => {
      const request = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${process.env.OPEN_WEATHER_KEY}`
      );

      return request.data;
    })
  );

  res.status(200).json({ message: "연결성공", data: getData });
});

app.get(`/user/sign`, async (req, res) => {
  try {
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
