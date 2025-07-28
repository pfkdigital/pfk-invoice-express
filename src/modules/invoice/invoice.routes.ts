import { Router } from 'express';
import * as invoiceController from './invoice.controller';
import { validationMiddleware } from '../../middleware/validation.middleware';
import {
  CreateInvoiceDtoSchema,
  UpdateInvoiceDtoSchema,
} from '../../types/invoice.schema';

export const invoiceRouter = Router();

invoiceRouter.post(
  '/',
  validationMiddleware(CreateInvoiceDtoSchema),
  invoiceController.createInvoice
);
invoiceRouter.get('/', invoiceController.getAllInvoices);
invoiceRouter.put(
  '/:id',
  validationMiddleware(UpdateInvoiceDtoSchema),
  invoiceController.updateInvoice
);
invoiceRouter.get('/:id', invoiceController.getInvoiceById);
invoiceRouter.delete('/:id', invoiceController.deleteInvoice);
