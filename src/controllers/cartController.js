import { db } from '../dbStrategy/mongo.js';

export async function addToCart(req,res){
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    const session = await db.collection('sessions').findOne({ token });

    const {productId,platform} = req.body;

    if (!session||!productId||!platform||userId) {
        return res.sendStatus(401);
    }
    
        
    if (error) {
        res.sendStatus(400);
        return;
    }
    
    await db.collection('carts').insertOne({ productId, platform, userId: session.userId, date:dayjs(new Date(),'DD/MM/YYYY').format('DD/MM/YYYY') });
    res.status(201).send('Entrada criada com sucesso');

}

export async function getCart(req,res){
    //aqui vai o get/cart/
    res.sendStatus(503);
}
