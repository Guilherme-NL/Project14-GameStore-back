import { db } from "../dbStrategy/mongo.js";
import dayjs from "dayjs";

export async function postToHistory(req, res) {
  const product = req.body;
  console.log(product);

  if (product.length > 1) {
    await db.collection("history").insertMany(product);
  } else {
    await db.collection("history").insertOne(product);
  }

  res.sendStatus(202);
}

export async function listHistory(req, res) {
  //aqui vai o get/history
  res.sendStatus(503);
}
