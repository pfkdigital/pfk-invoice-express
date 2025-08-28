import { Router } from 'express';
import * as graphController from './graph.controller';

const graphRouter = Router();

graphRouter.get('/monthly-revenue', graphController.getMonthlyRevenue);
graphRouter.get('/monthly-revenue/clients/:clientId', graphController.getMonthlyRevenueByClientId);
graphRouter.get(
  '/status-distribution',
  graphController.getInvoiceStatusDistribution,
);
graphRouter.get('/status-distribution/clients/:clientId', graphController.getInvoiceStatusDistributionByClientId);
graphRouter.get('/top-clients', graphController.getTopClientsByRevenue);
graphRouter.get('/aging-analysis', graphController.getInvoiceAgingAnalysis);
graphRouter.get('/cash-flow', graphController.getCashFlowProjection);
graphRouter.get('/payment-trends', graphController.getPaymentTrends);
graphRouter.get(
  '/client/:clientId/revenue',
  graphController.getRevenueByClient,
);
graphRouter.get('/dashboard', graphController.getDashboardData);

export { graphRouter };
