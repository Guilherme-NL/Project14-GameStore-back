import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import joi from "joi";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const server = express();

server.use(cors());
server.use(express.json());

//Mongo connection
const mongoClient = new MongoClient(process.env.URL_CONNECT_MONGO);
let db;

mongoClient.connect().then(() => {
  db = mongoClient.db("GameMaster");
});

//routes
server.post("/singup", async (req, res) => {
  const user = req.body;
  console.log(user);

  //Validation joi
  const userSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    image: joi.string().required(),
    password: joi.string().required(),
  });

  const { error } = userSchema.validate(user);

  if (error) {
    res.sendStatus(400);
    return;
  }

  //Email_validation
  const userValidation = await db
    .collection("singup")
    .findOne({ email: user.email });

  if (userValidation !== null) {
    res.sendStatus(409);
    return;
  }

  //password hash
  const passwordCrypt = bcrypt.hashSync(user.password, 10);

  await db.collection("singup").insertOne({ ...user, password: passwordCrypt });
  res.sendStatus(201);
});

server.post("/singin", async (req, res) => {
  const user = req.body;

  //Validation joi
  const userSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  const { error } = userSchema.validate(user);

  if (error) {
    res.sendStatus(422);
    return;
  }

  //user validation on mongodb
  const findUser = await db.collection("singup").findOne({ email: user.email });

  if (findUser === null) {
    return res.sendStatus(404);
  }

  //password validation
  const comparePassword = bcrypt.compareSync(user.password, findUser.password);

  if (!comparePassword) {
    return res.status(401).send("Senha ou email incorretos!");
  }

  //Token generatioin
  const token = uuid();

  await db.collection("sessions").insertOne({ token, userId: findUser._id });

  res.status(200).send({
    token,
    name: findUser.name,
    image: findUser.image,
    userId: findUser._id,
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT);
