const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const logger = require("morgan");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const dotenv = require("dotenv");

const atmosphereRouter = require("./routes/atmosphereRouter");
const covidRouter = require("./routes/covidRouter");
const crimeRouter = require("./routes/crimeRouter");
const exchangeRouter = require("./routes/exchangeRouter");
const locationRouter = require("./routes/locationRouter");
const chattingRouter = require("./routes/chattingRouter");

app.use(logger("combined"));
app.use(cors());
dotenv.config();

app.use("/atmosphere", atmosphereRouter);
app.use("/covid", covidRouter);
app.use("/crime", crimeRouter);
app.use("/exchange", exchangeRouter);
app.use("/location", locationRouter);
app.use("/chatting", chattingRouter);

let db;
MongoClient.connect(
  `mongodb+srv://${process.env.MONGODB_KEY}@cluster0.hl7ifoa.mongodb.net/?retryWrites=true&w=majority`,
  (err, client) => {
    if (err) return console.log(err);
    app.listen(3001, () => {
      console.log("서버");
    });
    db = client.db("bacharta");
  }
);

app.post("/user/sign", async (req, res) => {
  try {
    const token = req.headers.authorization;

    let userData = {};
    await axios
      .get("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "apllication/json",
        },
      })
      .then((res) => (userData = res.data));

    const kakaoPk = userData.id;

    let userRow = await db.collection("bacharta").findOne({ kakaoPk: kakaoPk });
    console.log(db, "dbdbbdb");
    if (!userRow) {
      userRow = await db
        .collection("bacharta")
        .insertOne({ kakaoPk: kakaoPk })
        .then(() => console.log("저장완료했습니다"));
    } else {
      console.log("db에 이미 저장되어 있습니다.");
    }

    const serviceToken = jwt.sign(
      {
        userNickname: userData.properties.nickname,
        userProfile: userData.properties.profile_image,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
        algorithm: "HS256",
      }
    );

    const kakaoUserData = {
      userNickname: userData.properties.nickname,
      userProfile: userData.properties.profile_image,
    };

    return res
      .header("Authorization", serviceToken)
      .status(200)
      .json({ message: "Login Success", kakaoUserData: kakaoUserData });
  } catch (err) {
    res.status(400).json({ message: "연결에러입니다." });
  }
});
