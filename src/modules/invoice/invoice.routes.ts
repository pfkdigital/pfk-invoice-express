import { Router } from 'express';
import * as invoiceController from './invoice.controller';
import { validationMiddleware } from '../../middleware/validation.middleware';
import {
  CreateInvoiceDtoSchema,
  UpdateInvoiceDtoSchema,
} from '../../types/invoice.schema';

export const invoiceRouter = Router();
invoiceRouter.post(
  '/invoices',
  validationMiddleware(CreateInvoiceDtoSchema),
  invoiceController.createInvoice,
);
invoiceRouter.get('/invoices', invoiceController.getAllInvoices);
invoiceRouter.get('/invoices/:id', invoiceController.getInvoiceById);
invoiceRouter.put(
  '/invoices/:id',
  validationMiddleware(UpdateInvoiceDtoSchema),
  invoiceController.updateInvoice,
);
invoiceRouter.delete('/invoices/:id', invoiceController.deleteInvoice);
