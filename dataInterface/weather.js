const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

const uri =
"mongodb+srv://dbadmin:dbadminpw@cluster0.fh6sx.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

const databaseName = 'sample_weatherdata';
const collName = 'data';

module.exports = {}
//getWeather by CallCenters
// https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/
module.exports.getWeather = async (callLetters) => {
  const database = client.db(databaseName);
  const weather = database.collection(collName);

  const query = { callLetters: callLetters};
  let weatherCursor = await weather.find(query).limit(10);

  return weatherCursor.toArray();
}
//getWeatherCount by CallCenters
module.exports.getWeatherCount = async (callLetters) => {
  const database = client.db(databaseName);
  const weather = database.collection(collName);
  //use pipeline operation: $match and $group 
  //and aggregation function: $sum on callLetters
  const query = [ {"$match": { "callLetters": callLetters }},{"$group": {"_id": {"callLetters" : "$callLetters"}, "Total_count_of_callLetters": {"$sum": 1}}}];
  let weatherCursor = await weather.aggregate(query).limit(20);

  return weatherCursor.toArray();
}
//searchWeather by one or more params
module.exports.searchWeather = async (queryObject) => {
  const database = client.db(databaseName);
  const weather = database.collection(collName);
  let queryOpt
  const options = { 
    sort: { callLetters: 1},
    projection: { _id: 1, callLetters: 1, sections: 1, airTemperature: 1, position: 1, pressure: 1, wind: 1 },
    limit: 10
  }

  try
  {
     //validate queryObject
    queryOpt = validateQueryObject(queryObject);
    if(queryOpt.error)
    {
      return {error: queryOpt.error};
    }
    else
    {
      let weatherList = await weather.find(queryOpt, options);

      return weatherList
      ? weatherList.toArray()
      : {
        error: `We've encountered an error. Please try again later.`,
      };
    }
    
  }
  catch (err)
  {
    return { error: err};
  }
  
}

//validate queryObject
function validateQueryObject(qryobj)
{
  let query
  if (qryobj.callLetters)
  {
    query = {...query, callLetters: qryobj.callLetters};
  }
  if (qryobj.section)
  {
    query = {...query, sections: [qryobj.section] };
  }
  // if both minAirTemp and maxAirTemp
  if (qryobj.minAirTemp && qryobj.maxAirTemp)
  {
    // if both minAirTemp and maxAirTemp are valid numbers
    if (!isNaN(Number(qryobj.minAirTemp)) && !isNaN(Number(qryobj.maxAirTemp)))
    {
      query = {...query, "airTemperature.value": { $gte: Number(qryobj.minAirTemp), $lte: Number(qryobj.maxAirTemp) } };
    }
    else
      {
        query = {error: "Both minAirTemp and maxAirTemp must be valid numbers."};
      }
  }
  else
  {
    //if minAirTemp
    if (qryobj.minAirTemp)
    {
      //minAirTemp is a number
      if (!isNaN(Number(qryobj.minAirTemp)))
      {      
        query = {...query, "airTemperature.value": { $gte: Number(qryobj.minAirTemp) }};
      }
      else
        query = {error: "minAirTemp must be a number."};
      }
    }
    if (qryobj.maxAirTemp)
    {
      if (!isNaN(Number(qryobj.maxAirTemp)))
      {
        query = {...query, "airTemperature.value": {$lte: Number(qryobj.maxAirTemp) }};
      }
      else
      {
        query = {error: "maxAirTemp must be a number."};
      }
    }
    // if passed validation then return query string
    return query;
  }

//Create weather
module.exports.create = async (newObj) => {
  const database = client.db(databaseName);
  const weather = database.collection(collName);

  if(!newObj.callLetters){
    // Invalid movie object, shouldn't go in database.
    return {error: "Weather must have a callLetters."}
  }
  if(!newObj.airTemperature.value){
    // Invalid movie object, shouldn't go in database.
    return {error: "Weather must have airtemperature!"}
  }
  if(!newObj.sections.length === 0){
    // Invalid movie object, shouldn't go in database.
    return {error: "Weather must have sections!"}
  }
  const result = await weather.insertOne(newObj);

  if(result.acknowledged){
    return { newObjectId: result.insertedId, message: `Item created! ID: ${result.insertedId}` }
  } else {
    return {error: "Something went wrong. Please try again."}
  }
}
