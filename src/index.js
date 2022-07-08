import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from './routes/authRouter.js';
import cartRouter from './routes/cartRouter.js';
import historyRouter from './routes/historyRouter.js';
import productRouter from './routes/productRouter.js';

dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());

server.use(authRouter);
server.use(cartRouter);
server.use(historyRouter);
server.use(productRouter);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('Server Online'));
