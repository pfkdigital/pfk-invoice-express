import { Router } from 'express';
import * as invoiceController from './invoice.controller';
import { validationHandler } from '../../handlers/validationHandler';
import {
  CreateInvoiceDtoSchema,
  UpdateInvoiceDtoSchema,
} from '../../types/invoice.schema';

export const invoiceRouter = Router();
invoiceRouter.post(
  '/invoices',
  validationHandler(CreateInvoiceDtoSchema),
  invoiceController.createInvoice,
);
invoiceRouter.get('/invoices', invoiceController.getAllInvoices);
invoiceRouter.get('/invoices/:id', invoiceController.getInvoiceById);
invoiceRouter.put(
  '/invoices/:id',
  validationHandler(UpdateInvoiceDtoSchema),
  invoiceController.updateInvoice,
);
invoiceRouter.delete('/invoices/:id', invoiceController.deleteInvoice);
