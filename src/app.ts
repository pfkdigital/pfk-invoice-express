import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { invoiceRouter } from './modules/invoice/invoice.routes';
import { clientsRouter } from './modules/client/client.routes';
import { graphRouter } from './modules/graph/graph.routes';
import { errorHandlerMiddleWare } from './middleware/error.middleware';
import { analyticsRouter } from './modules/analytics/analytics.routes';
import expressListRoutes from 'express-list-routes';

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

const apiRouter = express.Router();

apiRouter.use('/invoices', invoiceRouter);
apiRouter.use('/clients', clientsRouter);
apiRouter.use('/graph', graphRouter);
apiRouter.use('/analytics', analyticsRouter);

app.use('/api/v1', apiRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.use(errorHandlerMiddleWare);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
