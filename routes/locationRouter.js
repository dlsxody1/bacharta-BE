const express = require("express");
const app = express();
const router = express.Router();
const axios = require("axios");
const locationData = require("../locationData.json");
const dotenv = require("dotenv");

dotenv.config();

router.get("", async (req, res) => {
  console.log(locationData);
  const getData = await Promise.all(
    locationData.map(async ({ lat, lng }) => {
      const request = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${process.env.OPEN_WEATHER_KEY}`
      );

      return request.data.name;
    })
  );
  console.log(getData);
  res.status(200).json({ message: "연결성공", data: getData });
});

module.exports = router;
