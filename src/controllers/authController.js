import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { db } from '../dbStrategy/mongo.js';
import joi from 'joi';

export async function signIn(req,res){
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
}

export async function signUp(req,res){
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
}

export async function logOut(req,res){
    const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  const session = await db.collection('sessions').findOne({ token });

  if (!session) {
    return res.sendStatus(401);
  }


  await db.collection('sessions').deleteMany({ userId: session.userId });
  res.status(201).send('Session ended successfully');
}

