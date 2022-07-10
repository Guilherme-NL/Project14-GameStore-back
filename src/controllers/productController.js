import { db } from '../dbStrategy/mongo.js';

export async function listProducts(req,res){
    const searchTerm=req.query.searchTerm;
    let searchCategory=req.query.searchCategory;
    let searchOrder=req.query.searchOrder;
    let page=req.query.page;
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

    const filteredProducts=products.filter((item) => {
        return Object.values(item).join('').toLowerCase().includes(searchTerm.toLowerCase())
    })
    function turnToPage (array,page){
        const a=Number(page.toString()+"0");
        const b=Number(page.toString()+"9");
        return array.slice(a,b+1)
    }
    const result=turnToPage(filteredProducts,page)

    res.send(result);
}

export async function displayProduct(req,res){
    //aqui vai o get/products/:productId
    res.sendStatus(503);
}


