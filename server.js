const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const dataAccessLayer = require("./dataAccessLayer");
const { ObjectId, ObjectID } = require("mongodb");

dataAccessLayer.connect();

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.get("/api/plants", async (request, response) => {
  const plants = await dataAccessLayer.findAll();

  response.send(plants);
});

app.get("/api/plants/:id", async (request, response) => {
  const plantId = request.params.id;

  if (!ObjectID.isValid(plantId)) {
    response.status(400).send(`PlantID ${plantId} is incorrect.`);
    return;
  }

  const plantQuery = {
    _id: new ObjectId(plantId),
  };

  let plant;

  try {
    plant = await dataAccessLayer.findOne(plantQuery);
  } catch (error) {
    response.status(400).send(`Plant with id ${plantId} not found!`);
    return;
  }
  response.send(plant);
});

app.post("/api/plants", async (request, response) => {
  const body = request.body;

  if (!body.name || !body.category || !body.sun || !body.water) {
    response
      .status(400)
      .send(
        "Bad Request. Validation Error. Missing name, cateogory, sun, or water!"
      );
    return;
  }

  if (typeof body.name !== "string") {
    response.status(400).send("The name parameter must be of type string");
    return;
  }

  if (typeof body.category !== "string") {
    response.status(400).send("The category parameter must be of type string");
    return;
  }

  if (typeof body.sun !== "string") {
    response.status(400).send("The sun parameter must be of type string");
    return;
  }

  if (typeof body.water !== "string") {
    response.status(400).send("The water parameter must be of type string");
    return;
  }

  await dataAccessLayer.insertOne(body);

  response.status(201).send();
});

app.put("/api/plants/:id", async (request, response) => {
  const plantId = request.params.id;
  const body = request.body;

  if (!ObjectID.isValid(plantId)) {
    response.status(400).send(`PlantID ${plantId} is incorrect.`);
    return;
  }

  if (body.name && typeof body.name !== "string") {
    response.status(400).send("The name parameter must be of type string");
    return;
  }

  if (body.category && typeof body.category !== "string") {
    response.status(400).send("The category parameter must be of type string");
    return;
  }

  if (body.sun && typeof body.sun !== "string") {
    response.status(400).send("The sun parameter must be of type string");
    return;
  }

  if (body.water && typeof body.water !== "string") {
    response.status(400).send("The water parameter must be of type string");
    return;
  }

  const plantQuery = {
    _id: new ObjectId(plantId),
  };

  try {
    await dataAccessLayer.updateOne(plantQuery, body);
  } catch (error) {
    response.status(404).send(`Plant with id ${plantId} not found!`);
    return;
  }

  response.send();
});

app.delete("/api/plants/:id", async (request, response) => {
  const plantId = request.params.id;

  if (!ObjectID.isValid(plantId)) {
    response.status(400).send(`PlantID ${plantId} is incorrect.`);
    return;
  }

  const plantQuery = {
    _id: new ObjectId(plantId),
  };

  try {
    await dataAccessLayer.deleteOne(plantQuery);
  } catch (error) {
    response.status(404).send(`Plant with id ${plantId} not found!`);
    return;
  }

  response.send();
});

const port = process.env.PORT ? process.env.PORT : 3005;
app.listen(port, () => {
  console.log("API STARTED!");
});
