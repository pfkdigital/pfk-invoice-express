import express from 'express';
import dotenv from 'dotenv';
import { invoiceRouter } from './modules/invoice/invoice.routes';
import { clientsRouter } from './modules/user/user.routes';
import { errorHandlerMiddleWare } from './middleware/errorHandler';
import { prismaErrorHandler } from './handlers/prismaHandler';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/v1', invoiceRouter);
app.use('/api/v1', clientsRouter);

app.use(errorHandlerMiddleWare);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
