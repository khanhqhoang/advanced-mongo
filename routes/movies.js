const { Router } = require("express");
const router = Router();

const movieData = require('../dataInterface/movies');

// curl http://localhost:5000/movies
router.get("/", async (req, res, next) => {
  let movieList = await movieData.getAll()

  if(movieList){
    res.status(200).send(movieList)
  } else {
    // If movieList is empty/null, something serious is wrong with the MongoDB connection.
    res.status(500).send({error: "Something went wrong. Please try again."})
  }
});

// This route handles either id or title as an identifier.
// curl http://localhost:5000/movies/573a1390f29313caabcd4135
// curl http://localhost:5000/movies/Jurassic%20Park
router.get("/:id", async (req, res, next) => {
  const result = await movieData.getByIdOrTitle(req.params.id)

  if(!result)
  {
    resultStatus = 404;
    res.status(resultStatus).send({error: "Movie not found!"});
  } 
  else 
  {
    resultStatus = 200;
    res.status(resultStatus).send(result);
  }

});
//find movie by genre
//curl http://localhost:5000/movies/genres/Short
router.get("/genres/:genreName", async (req, res, err) => {
  try
  {
    const result = await movieData.getByGenre(req.params.genreName);
    let resultStatus;
    if(result.error)
    {
      resultStatus = 500;
      res.status(resultStatus).send({message: "We encouterred an error!"});
    } 
    else 
    {
      resultStatus = 200;
      
      res.status(resultStatus).send(result);
    }
  }
  catch (err)
  {
    resultStatus = 500;
    res.status(resultStatus).send({error: "Something went wrong!"});
  }
  
  
});
//get all comments for a movie id
// curl http://localhost:5000/movies/573a1391f29313caabcd8978/comments
router.get("/:id/comments", async(req, res) => {
  
  let resultStatus;
  const result = await movieData.getAllComments(req.params.id);

  if (result)
  {
    resultStatus = 200;
    res.status(resultStatus).send(result);
  }
  else 
  {
    resultStatus = 404;
    res.status(resultStatus).send({message: `No comment found with the movie id: ${req.params.id}`});
  }
     
})
//get a comment by commentId
// curl http://localhost:5000/movies/comments/5a9427648b0beebeb6957bda
router.get("/comments/:id([0-9a-fA-F]{24})", async(req, res) => {
  let resultStatus;
  const result = await movieData.getCommentById(req.params.id);
  if (result)
  {
    resultStatus = 200;
    res.status(resultStatus).send(result);
  }
  else
  {
    resultStatus = 404;
    res.status(resultStatus).send(result);
  }
  console.log(resultStatus);
})

// curl -X POST -H "Content-Type: application/json" -d '{"title":"Llamas From Space", "plot":"Aliens..."}' http://localhost:5000/movies
router.post("/", async (req, res, next) => {
  let resultStatus;
  const result = await movieData.create(req.body);

  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// curl -X POST -H "Content-Type: application/json" -d '{"name":"Cinephile Cyprus", "text":"Wow!"}' http://localhost:5000/movies/573a1391f29313caabcd8978/comments
router.post("/:id([0-9a-fA-F]{24})/comments", async(req, res) => {
  let resultStatus
  //validate name
  if (req.body.name ==="")
  {
    resultStatus = 400;
    res.status(resultStatus).send({error: "Comment must have a valid movieid."});
  }
  else {
    const result = await movieData.createComment(req.params.id, req.body);
    if(result.error)
    {
      resultStatus = 400;
      res.status(resultStatus).send({error: "Something went wrong. Please try again."});
    } 
    else 
    {
      resultStatus = 200;
      res.status(resultStatus).send(result);
    }
  }
  
})

// curl -X PUT -H "Content-Type: application/json" -d '{"title": "Shark...","plot":"Sharks..."}' http://localhost:5000/movies/573a13a3f29313caabd0e77b
router.put("/:id([0-9a-fA-F]{2git 4})", async (req, res, err) => {
  let resultStatus;
  try
  {
    const result = await movieData.updateById(req.params.id, req.body)
    console.log(result);
    if(result.error){
      resultStatus = 400;
    } else {
      resultStatus = 200;
    }
    res.status(resultStatus).send(result);
  }
  catch (err)
  {
    resultStatus = 400;
    res.status(resultStatus).send({error: "Something went wrong. Please try again!"});
  }
  
});

// curl -X PUT -H "Content-Type: application/json" -d '{"text":"Test..."}' http://localhost:5000/movies/comments/5a9427648b0beebeb6957bda
router.put("/comments/:id([0-9a-fA-F]{24})", async (req, res, next) => {

  let resultStatus;
  //validate valid text param
  if(!req.body.text)
  {
    resultStatus = 404;
    res.status(resultStatus).send({error: 'Invalid comment text!'});
  } 
  else 
  {
    resultStatus = 200;
    const result = await movieData.updateCommentById(req.params.id, req.body);
    res.status(resultStatus).send(result);
  }
});
// curl -X DELETE http://localhost:5000/movies/000
router.delete("/:id([0-9a-fA-F]{24})", async (req, res, next) => {
  const result = await movieData.deleteById(req.params.id);

  if(result.error)
  {
    resultStatus = 400;
  } 
  else 
  {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

//  curl -X DELETE http://localhost:5000/movies/comments/62e082f7b04837f399c01a2b
router.delete("/comments/:commentId([0-9a-fA-F]{24})", async(req, res)=>{
  const result = await movieData.deleteCommentById(req.params.commentId)
  if(result.error){
    resultStatus = 404;
  } else {
    resultStatus = 200;
  }
  res.status(resultStatus).send(result);
})

module.exports = router;
