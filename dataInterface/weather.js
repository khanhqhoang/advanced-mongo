const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

const uri =
"mongodb+srv://dbadmin:dbadminpw@cluster0.fh6sx.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

const databaseName = 'sample_weatherdata';
const collName = 'data';

module.exports = {}

// https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/
module.exports.getWeather = async (callLetterId) => {
  const database = client.db(databaseName);
  const weather = database.collection(collName);

  const query = { callLetterId: ObjectId(movieId)};
  let weatherCursor = await weather.find(query).limit(10);

  return weatherCursor.toArray();
}
