import { db } from '../dbStrategy/mongo.js';

export async function listProducts(req,res){
    const searchTerm=req.query.searchTerm;
    let searchCategory=req.query.searchCategory;
    let searchOrder=req.query.searchOrder;
    if(!searchCategory){
        searchCategory="released";
    }
    if(!searchOrder){
        searchOrder=-1;
    }


    const products = await db
    .collection('products')
    .find().sort({[searchCategory]: [searchOrder]})
    .toArray();

    const result=products.filter((item) => {
        return Object.values(item).join('').toLowerCase().includes(searchTerm.toLowerCase())
    })

    res.send(result);
}

export async function displayProduct(req,res){
    //aqui vai o get/products/:productId
    res.sendStatus(503);
}


