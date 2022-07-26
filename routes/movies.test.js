const request = require("supertest");
const server = require("../server");

// Declare the jest will mock movieData. Must be before the require statement.
jest.mock("../dataInterface/movies");
const movieData = require("../dataInterface/movies");

describe("/movies routes", () => {
  beforeEach(() => {});

  describe("GET /", () => {
    it("should return an array on success", async () => {
      movieData.getAll.mockResolvedValue([{ _id: "890", title: "One Day" }]);
      const res = await request(server).get("/movies");

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message on error", async () => {
      movieData.getAll.mockResolvedValue(null);

      const res = await request(server).get("/movies");

      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("GET /:id", () => {
    it("should return a single movie on success", async () => {
      movieData.getByIdOrTitle.mockResolvedValue([{ _id: "890", title: "One Day" }]);
      const res = await request(server).get("/movies/890");
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return a status code of 404 if movie not found", async () => {
      movieData.getByIdOrTitle.mockResolvedValue(null);
      const res = await request(server).get("/movies/The%20Kisses");
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("POST /", () => {
    it("should return the new movie on success", async () => {
      movieData.create.mockResolvedValue({newObjectId: 1234, message: "Item Created!"})
      const res = await request(server).post("/movies/").send({title: "Llamas From Space", plot:"Aliens..."});
      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message if body is missing title", async () => {
      movieData.create.mockResolvedValue({error: "Movies must have a title."});
      const res = await request(server).post("/movies").send({title: "", plot:"Aliens..."});
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });
    it("should return an error message if movie fails to be created", async () => {
      movieData.create.mockResolvedValue({error: "Something went wrong. Please try again."});
      const res = await request(server).post("/movies").send({title: "Llamas From Space", plot:"Aliens..."});
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("PUT /:id", () => {
    it("should return the updated movie on success", async () => {
      movieData.updateById.mockResolvedValue({ _id: "573a13a3f29313caabd0e77b", title: "New Title", plot: "New Plot..." });
      const res = await request(server).put("/movies/573a13a3f29313caabd0e77b").send({title: "New Title", plot:"New Plot..."});
      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message if movie fails to be updated", async () => {
      movieData.updateById.mockResolvedValue(null);
      const res = await request(server).put("/movies/890").send({title: "New Title", plot:"New Plot..."});
      expect(res.statusCode).toEqual(404);
      //expect(res.body.error).toBeDefined();
    });
  });

  describe("DELETE /:id", () => {
    it("should return a message on success", async () => {
      movieData.deleteById.mockResolvedValue([{ _id: "890", title: "One Day" }]);
      const res = await request(server).delete("/movies/573a13a3f29313caabd0e77b").send();
      expect(res.statusCode).toEqual(200);
    });
    it("should return a error message if movie fails to be deleted", async () => {
      movieData.deleteById.mockResolvedValue([{ _id: "00000", title: "One Day" }]);
      const res = await request(server).delete("/movies/00000").send();
      expect(res.statusCode).toEqual(404);
      //expect(res.body.error).toBeDefined();
    });
  });

  describe("GET /movies/genres/:genreName", () => {
    it("should return an array of movies on success", async () => {
      // TODO: Mock the correct data interface method
      movieData.getByGenre.mockResolvedValue([{ _id: "1890", title: "One Day", genres:["drama", "comedy"] }]);
      const res = await request(server).get("/movies/genres/Short");
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an empty array if no movies match genre", async () => {
      // TODO: Mock the correct data interface method
      movieData.getByGenre.mockResolvedValue([]);
      const res = await request(server).get("/movies/genres/UEOA921DI");
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(0);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message on error", async () => {
      // TODO: Mock the correct data interface method
      movieData.getByGenre.mockResolvedValue({error: "Movie not found!"});
      const res = await request(server).get("/movies/genres/short");

      expect(res.statusCode).toEqual(500);
      //expect(res.body.error).toBeDefined();
    });
  });
});
