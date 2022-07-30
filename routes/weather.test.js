const request = require("supertest");
const server = require("../server");

// Declare the jest will mock movieData. Must be before the require statement.
jest.mock("../dataInterface/weather");
const weatherData = require("../dataInterface/weather");
// "curl http://localhost:5000/weather/PLAT"
describe("GET /:callLetters", () => {
  it("should return weather entries that match callCenters on success", async () => {
    weatherData.getWeather.mockResolvedValue([
      { _id: "890", callLetters: "ABCD" },
    ]);
    const res = await request(server).get("/weather/PLAT");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toEqual(true);
    expect(res.body.error).not.toBeDefined();
  });
  it("should return a status code of 422 if movie not found", async () => {
    weatherData.getWeather.mockResolvedValue(null);
    const res = await request(server).get("/weather/ZZZZ");
    expect(res.statusCode).toEqual(422);
    expect(res.body.error).toBeDefined();
  });
});
//curl "http://localhost:5000/weather?minAirTemp=5"

describe("GET /", () => {
    it("should return weather entries that match url params on success", async () => {
        weatherData.searchWeather.mockResolvedValue([
          { _id: "890", callLetters: "ABCD" },
        ]);
        const res = await request(server).get("/weather/?minAirTemp=5");
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toEqual(true);
        expect(res.body.error).not.toBeDefined();
      });
});
//curl "http://localhost:5000/weather?minAirTemp=5&maxAirTemp=90"

describe("GET /", () => {
    it("should return weather entries that match url params on success", async () => {
        weatherData.searchWeather.mockResolvedValue([
          { _id: "890", callLetters: "ABCD" },
        ]);
        const res = await request(server).get("/weather/?minAirTemp=5&maxAirTemp=90");
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toEqual(true);
        expect(res.body.error).not.toBeDefined();
      });
});
//curl "http://localhost:5000/weather?section=AG1"

describe("GET /", () => {
    it("should return weather entries that match url params on success", async () => {
        weatherData.searchWeather.mockResolvedValue([
          { _id: "890", callLetters: "ABCD" },
        ]);
        const res = await request(server).get("/weather/?section=AG1");
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toEqual(true);
        expect(res.body.error).not.toBeDefined();
      });
});
//curl "http://localhost:5000/weather?callLetters=VC81&minAirTemp=35"
describe("GET /", () => {
    it("should return weather entries that match url params on success", async () => {
        weatherData.searchWeather.mockResolvedValue([
          { _id: "890", callLetters: "ABCD" },
        ]);
        const res = await request(server).get("/weather/?callLetters=VC81&minAirTemp=35");
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toEqual(true);
        expect(res.body.error).not.toBeDefined();
      });
});
//  curl -X POST -H "Content-Type: application/json" -d '{"callLetters":"AAAA", "airTemperature":{"value": 65, "quality": "1"}, "sections":["LB1","LB2","LB3"]}' http://localhost:5000/weather
describe("POST /", () => {
  it("should return the new weather entry on success", async () => {
    weatherData.create.mockResolvedValue({
      newObjectId: 1234,
      message: "Item Created!",
    });
    const res = await request(server)
      .post("/weather/")
      .send({
        callLetters: "AAAA",
        airTemperature: { value: 65, quality: "1" },
        sections: ["LB1", "LB2", "LB3"],
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.error).not.toBeDefined();
  });
  it("should return an error message if callLetter is missing", async () => {
    weatherData.create.mockResolvedValue({
      error: "Weather must have a callLetters.",
    });
    const res = await request(server)
      .post("/weather")
      .send({
        "": "",
        airTemperature: { value: 65, quality: "1" },
        sections: ["LB1", "LB2", "LB3"],
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBeDefined();
  });
  it("should return an error message if weather entry fails to be created", async () => {
    weatherData.create.mockResolvedValue({
      error: "Something went wrong. Please try again.",
    });
    const res = await request(server)
      .post("/weather")
      .send({
        callLetters: "AAAA",
        airTemperature: { value: 65, quality: "1" },
        sections: ["LB1", "LB2", "LB3"],
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBeDefined();
  });
});
