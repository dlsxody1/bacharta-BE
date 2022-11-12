const express = require("express");
const app = express();
const router = express.Router();
const axios = require("axios");

router.post("/", (req, res) => {
  console.log("연결");
});

module.exports = router;
