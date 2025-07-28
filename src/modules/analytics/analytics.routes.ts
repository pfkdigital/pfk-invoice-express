import { Router } from "express";
import * as analyticsController from './analytics.controller';

export const analyticsRouter = Router();

analyticsRouter.get('/invoices/count', analyticsController.getInvoiceCount);
analyticsRouter.get('/clients/count', analyticsController.getClientCount);
analyticsRouter.get('/invoices/total', analyticsController.getTotalAmount);
analyticsRouter.get('/invoices/total/unpaid', analyticsController.getTotalAmountUnpaid);
