const express = require("express");
const router = express.Router();
const axios = require("axios");
const { exchangeAPI } = require("../api/api");

router.get("", async (req, res) => {
  const getData = await axios.get(exchangeAPI);

  res.status(200).json({ message: "성공", data: getData.data });
});

module.exports = router;
