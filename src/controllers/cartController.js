import { db } from "../dbStrategy/mongo.js";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";

export async function addToCart(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  const session = await db.collection("sessions").findOne({ token });

  const { productId, platform } = req.body;
  console.log(productId);

  if (!session || !productId || !platform) {
    return res.sendStatus(401);
  }

  const product = await db
    .collection("products")
    .findOne({ _id: ObjectId(productId) });
  console.log(product);

  await db.collection("cart").insertOne({
    ...product,
    platforms: platform,
    userId: new ObjectId(session.userId),
    date: dayjs(new Date(), "DD/MM/YYYY").format("DD/MM/YYYY"),
  });
  res.status(201).send("Entrada criada com sucesso");
}

export async function getCart(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  const session = await db.collection("sessions").findOne({ token });

  if (!session) {
    return res.sendStatus(401);
  }

  const cart = await db
    .collection("cart")
    .find({ userId: ObjectId(session.userId) })
    .toArray();

  console.log(cart);

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
  console.log(deleteId);

  res.sendStatus(202);
}
