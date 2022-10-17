const express = require("express");
const router = express.Router();
const app = express();
const axios = require("axios");
const dotenv = require("dotenv");
const { covidAPI } = require("../api/api");

dotenv.config();

router.get("/", async (req, res) => {
  const getData = await axios.get(covidAPI);

  return res.status(200).json({
    message: "covid data 통신 성공",
    data: getData.data.response.result,
  });
});

module.exports = router;
