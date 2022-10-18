const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const logger = require("morgan");
const atmosphereRouter = require("./routes/atmosphereRouter");
const covidRouter = require("./routes/covidRouter");
const crimeRouter = require("./routes/crimeRouter");
const exchangeRouter = require("./routes/exchangeRouter");
const locationRouter = require("./routes/locationRouter");
const cors = require("cors");
const loginRouter = require("./routes/loginRouter");
app.use(logger("combined"));

let db;
app.use(cors());
app.use("/user/sign", loginRouter);
app.use("/atmosphere", atmosphereRouter);
app.use("/covid", covidRouter);
app.use("/crime", crimeRouter);
app.use("/exchange", exchangeRouter);
app.use("/location", locationRouter);

MongoClient.connect(
  `mongodb+srv://${process.env.MONGODB_KEY}@cluster0.hl7ifoa.mongodb.net/?retryWrites=true&w=majority`,
  (err, client) => {
    if (err) return console.log(연결오류);
    app.listen(3001, () => {
      console.log("서버");
    });
    db = client.db("bacharta");
  }
);

module.exports = { db };
