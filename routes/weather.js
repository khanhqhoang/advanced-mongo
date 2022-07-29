const { Router } = require("express");
const router = Router();

const weatherData = require("../dataInterface/weather");
// get weather by CallLetter
// curl http://localhost:5000/weather:callLetterId
router.get("/", async (req, res, next) => {
  console.log(req.query);
  let weatherList = await weatherData.getWeather();

  if (weatherList) {
    res.status(200).send(weatherList);
  } else {
    // If movieList is empty/null, something serious is wrong with the MongoDB connection.
    res.status(500).send({ error: "Something went wrong. Please try again." });
  }
});

module.exports = router;
