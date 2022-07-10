import { db } from "../dbStrategy/mongo.js";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";

export async function postToHistory(req, res) {
  const product = req.body;
  const session = res.locals.session;

  await product.map((e) => {
    db.collection("history").insertOne({
      ...e,
      userId: ObjectId(session.userId),
    });
  });

  res.sendStatus(202);
}

export async function listHistory(req, res) {
  const session = res.locals.session;

  const history = await db
    .collection("history")
    .find({ userId: ObjectId(session.userId) })
    .toArray();

  res.send(history);
}
