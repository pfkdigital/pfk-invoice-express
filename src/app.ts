import express from 'express';
import dotenv from 'dotenv';
import { invoiceRouter } from './modules/invoice/invoice.routes';
import { clientsRouter } from './modules/user/user.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/v1', invoiceRouter);
app.use('/api/v1', clientsRouter);

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
})