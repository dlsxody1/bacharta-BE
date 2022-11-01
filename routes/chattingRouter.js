const express = require("express");
const app = express();
const router = express.Router();
const axios = require("axios");
const convert = require("xml-js");
const { atmosphereAPI } = require("../api/api");
const xmlParser = require("express-xml-bodyparser");

router.get("/", (req, res) => {
  console.log("접속?");
});

module.exports = router;
