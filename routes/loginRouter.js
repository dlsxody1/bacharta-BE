const express = require("express");
const router = express.Router();
const app = express();
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { db } = require("../server");
app.use(cors());
dotenv.config();

router.get("", async (req, res) => {
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
    res.status(400).json({ message: "연결에러입니다." });
  }
});

module.exports = router;
