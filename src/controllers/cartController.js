import { db } from "../dbStrategy/mongo.js";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";

export async function addToCart(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  const session = await db.collection("sessions").findOne({ token });

  const { productId, platform } = req.body;

  if (!session || !productId || !platform) {
    return res.sendStatus(401);
  }

  const product = await db
    .collection("products")
    .findOne({ _id: ObjectId(productId) });

  await db.collection("cart").insertOne({
    ...product,
    platforms: platform,
    userId: ObjectId(session.userId),
    date: dayjs(new Date(), "DD/MM/YYYY").format("DD/MM/YYYY"),
  });
  res.status(201).send("Entrada criada com sucesso");
}

export async function getCart(req, res) {
  const session = res.locals.session;

  const cart = await db
    .collection("cart")
    .find({ userId: ObjectId(session.userId) })
    .toArray();

  res.send(cart);
}

export async function deleteCart(req, res) {
  const deleteId = req.params.id;

  const session = res.locals.session;

  if (!deleteId) {
    await db
      .collection("cart")
      .deleteMany({ userId: ObjectId(session.userId) });
  }

  await db
    .collection("cart")
    .deleteOne({ _id: ObjectId(deleteId), userId: ObjectId(session.userId) });

  res.sendStatus(202);
}
