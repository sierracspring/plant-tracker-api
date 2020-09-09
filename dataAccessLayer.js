const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const url = process.env.MONGODB_URL;
const databaseName = process.env.MONGODB_DATABASE;

console.log(url);
console.log(databaseName);

const collectionName = "plants";
const settings = {
  usedUnifiedTopology: true,
};

let databaseClient;
let plantCollection;

const connect = function () {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, settings, (error, client) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      databaseClient = client.db(databaseName);
      plantCollection = databaseClient.collection(collectionName);
      console.log("SUCCESSFULLY CONNECTED TO DATABASE!");
      resolve();
    });
  });
};

const insertOne = function (plant) {
  return new Promise((resolve, reject) => {
    plantCollection.insertOne(plant, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      console.log("SUCCESSFULLY INSERTED A NEW DOCUMENT");
      resolve();
    });
  });
};

const findAll = function () {
  const query = {};
  return new Promise((resolve, reject) => {
    plantCollection.find(query).toArray((error, documents) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      console.log(`SUCCESSFULLY FOUND ${documents.length} DOCUMENTS`);
      resolve(documents);
    });
  });
};

const findOne = function (query) {
  return new Promise((resolve, reject) => {
    plantCollection.find(query).toArray((error, documents) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      if (documents.length > 0) {
        console.log("SUCCESSFULLY FOUND DOCUMENT!");
        const document = documents[0];
        resolve(document);
      } else {
        reject("No document found!");
      }
    });
  });
};

const updateOne = function (query, newPlant) {
  const newPlantQuery = {};

  if (newPlant.name) {
    newPlantQuery.name = newPlant.name;
  }

  if (newPlant.category) {
    newPlantQuery.category = newPlant.category;
  }

  if (newPlant.sun) {
    newPlantQuery.sun = newPlant.sun;
  }

  if (newPlant.water) {
    newPlantQuery.water = newPlant.water;
  }

  console.log(query);

  return new Promise((resolve, reject) => {
    plantCollection.updateOne(
      query,
      { $set: newPlantQuery },
      (error, result) => {
        if (error) {
          console.log(error);
          reject(error);
          return;
        } else if (result.modifiedCount === 0) {
          console.log("No Documnt Found");
          reject("No Document Found");
          return;
        }

        console.log("SUCCESSFULLY UPDATED DOCUMENT!");
        resolve();
      }
    );
  });
};

const deleteOne = function (query) {
  return new Promise((resolve, reject) => {
    plantCollection.deleteOne(query, (error, result) => {
      console.log(result);
      if (error) {
        console.log(error);
        reject(error);
        return;
      } else if (result.deletedCount === 0) {
        console.log("No Document Found");
        reject("No Document Found");
        return;
      }

      console.log("SUCCESSFULLY DELETED DOCUMENT");
      resolve();
    });
  });
};

module.exports = { connect, insertOne, findAll, findOne, updateOne, deleteOne };
