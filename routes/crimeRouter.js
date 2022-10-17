const express = require("express");
const app = express();
const router = express.Router();
const axios = require("axios");
const convert = require("xml-js");

const { crimeAPI } = require("../api/api");
const xmlParser = require("express-xml-bodyparser");

app.use(xmlParser());

router.get("/", async (req, res) => {
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

module.exports = router;
