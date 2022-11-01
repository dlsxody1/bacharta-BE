const express = require("express");
const app = express();
const router = express.Router();
const axios = require("axios");
const convert = require("xml-js");
const { atmosphereAPI } = require("../api/api");
const xmlParser = require("express-xml-bodyparser");

app.use(xmlParser());

const date = new Date();
const fullDay = `${date.getFullYear()}${
  date.getMonth() > 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
}${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;

router.get("/:location", async (req, res) => {
  let atmosphereObject = {};
  let { location } = req.params;

  const getData = await axios.get(
    `${atmosphereAPI}&stationcode=${location}&date=${fullDay}&timecode=RH02&itemcode=90303&serviceKey=${process.env.ATMOSPHERE_KEY}`,
    (err, res, body) => {
      const result = body;
      const xmlToJson = convert.xml2js(result, {
        compact: true,
        spaces: 4,
      });
      return xmlToJson;
    }
  );

  const xmlToJson = convert.xml2js(getData.data, { compact: true, spaces: 4 });

  let stationcode = xmlToJson.response?.body.items.item["stationcode"]._text;
  let atmosphereValue = xmlToJson.response?.body.items.item["value"]._text;

  atmosphereObject = {
    stationcode: stationcode,
    atmosphereValue: atmosphereValue,
  };
  res.status(200).json({ message: "성공", data: atmosphereObject });
});

module.exports = router;
