const express = require("express");
const app = express();
const router = express.Router();
const axios = require("axios");
const convert = require("xml-js");
const { atmosphereAPI } = require("../api/api");
const xmlParser = require("express-xml-bodyparser");

app.use(xmlParser());

router.get("/atmosphere/:location", async (req, res) => {
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
      return (atmosphereObject = xmlToJson);
    }
  );

  const xmlToJson = convert.xml2js(getData.data, { compact: true, spaces: 4 });
  console.log(xmlToJson.header);
  res.status(200).json({ message: "성공", data: xmlToJson });
});

module.exports = router;
