import { Router } from 'express';
import * as clientController from './client.controller';
import { validationMiddleware } from '../../middleware/validation.middleware';
import { CreateClientSchema } from '../../types/client.schema';
import { UpdateInvoiceDtoSchema } from '../../types/invoice.schema';

export const clientsRouter = Router();
clientsRouter.post(
  '/',
  validationMiddleware(CreateClientSchema),
  clientController.createClient,
);
clientsRouter.get('', clientController.getAllClients);
clientsRouter.get(
  '/:id',
  validationMiddleware(UpdateInvoiceDtoSchema),
  clientController.getClientById,
);
clientsRouter.put('/:id', clientController.updateClient);
clientsRouter.delete('/:id', clientController.deleteClient);
