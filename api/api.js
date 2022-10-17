const dotenv = require("dotenv");
dotenv.config();

const date = new Date();
const fullDay = `${date.getFullYear()}${
  date.getMonth() > 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
}${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;

const exchangeAPI = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${process.env.EXCHANGE_KEY}&searchdate=${fullDay}&data=AP01`;
const atmosphereAPI = `http://apis.data.go.kr/1480523/MetalMeasuringResultService/MetalService?numOfRows=1&pageNo=1&resultType=xml&stationcode=1&date=${fullDay}&timecode=RH02&itemcode=90303&serviceKey=${process.env.ATMOSPHERE_KEY}`;
const covidAPI = `http://apis.data.go.kr/1790387/covid19CurrentStatusHospitalizations/covid19CurrentStatusHospitalizationsJson?serviceKey=${process.env.COVID_KEY}`;
const crimeAPI = "http://api.sexoffender.go.kr/openapi/SOCitysStats/";

module.exports = { exchangeAPI, atmosphereAPI, covidAPI, crimeAPI };
