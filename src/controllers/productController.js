import { db } from '../dbStrategy/mongo.js';

export async function listProducts(req,res){
    const products = await db
    .collection('products')
    .find().sort({"released":-1})
    .toArray();

    res.send(products);
}

export async function displayProduct(req,res){
    //aqui vai o get/products/:productId
    res.sendStatus(503);
}


