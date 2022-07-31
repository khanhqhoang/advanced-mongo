const { Router } = require("express");
const router = Router();
const bodyParser = require('body-parser');

const weatherData = require("../dataInterface/weather");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// get weather by callLetters
// "curl http://localhost:5000/weather/PLAT"
router.get("/:callCenters", async (req, res, next) => {
  let statusCode
  let weatherList = await weatherData.getWeather(req.params.callCenters);

  if (weatherList) {
    statusCode = 200
    res.status(statusCode).send(weatherList);
  } 
  else 
  {
    statusCode = 422
    // If weatherList is empty/null, something serious is wrong with the MongoDB connection.
    res.status(statusCode).send({ error: "Something went wrong. Please try again." });
  }
});
// extra credit work
// get total count of weather entries group by callLetters
// using aggregation

router.get("/count/:callCenters", async (req, res, next) => {
  let statusCode
  let weatherCountList = await weatherData.getWeatherCount(req.params.callCenters);

  if (weatherCountList.length>0) {
    statusCode = 200
    res.status(statusCode).send(weatherCountList);
  } 
  else 
  {
    statusCode = 422
    // If weatherList is empty/null, something serious is wrong with the MongoDB connection.
    res.status(statusCode).send({ error: "callLetters not found. Please try again." });
  }
});

//get weather by one or more params
//curl "http://localhost:5000/weather?minAirTemp=5"
//curl "http://localhost:5000/weather?minAirTemp=5&maxAirTemp=90"
//curl "http://localhost:5000/weather?section=AG1"
//curl "http://localhost:5000/weather?callLetters=VC81&minAirTemp=35"

router.get("/", async (req, res, next) => {
  let resultStatus
  // Validate for a valid url query param
  if (req.query)
  {

    let weatherList = await weatherData.searchWeather(req.query);
    if (weatherList.length>0) {
      resultStatus = 200
      res.status(resultStatus).send(weatherList);
    } 
    else 
    {
      // If weatherList is empty/null, something serious is wrong with the MongoDB connection.
      resultStatus = 500
      res.status(resultStatus).send({ error: "Something went wrong. Please try again." });
    }
  }
  else
  {
    // If no url param provided
    res.status(500).send({ error: "No query param provided in url. Please try again." });
  }
  
});
//post a weather entry
//  curl -X POST -H "Content-Type: application/json" -d '{"callLetters":"AAAA", "airTemperature":{"value": 65, "quality": "1"}, "sections":["LB1","LB2","LB3"]}' http://localhost:5000/weather
router.post("/", async (req, res, next) => {
  let resultStatus;
  const result = await weatherData.create(req.body);

  if(result.error){
    resultStatus = 400;
  } 
  else 
  {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});
module.exports = router;
