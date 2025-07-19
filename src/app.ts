import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { invoiceRouter } from './modules/invoice/invoice.routes';
import { clientsRouter } from './modules/user/user.routes';
import { errorHandlerMiddleWare } from './middleware/error.middleware';
import { prismaErrorHandler } from './handlers/prismaHandler';

dotenv.config();

const corsOptions: cors.CorsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
  allowedHeaders: 'Content-Type, Authorization',
};

const app = express();
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/v1', invoiceRouter);
app.use('/api/v1', clientsRouter);

app.use(errorHandlerMiddleWare);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
