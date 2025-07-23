import { Router } from 'express';
import * as clientController from './client.controller';
import { validationMiddleware } from '../../middleware/validation.middleware';
import { CreateClientSchema } from '../../types/client.schema';
import { UpdateInvoiceDtoSchema } from '../../types/invoice.schema';

export const clientsRouter = Router();
clientsRouter.post(
  '/clients',
  validationMiddleware(CreateClientSchema),
  clientController.createClient,
);
clientsRouter.get('/clients', clientController.getAllClients);
clientsRouter.get(
  '/clients/:id',
  validationMiddleware(UpdateInvoiceDtoSchema),
  clientController.getClientById,
);
clientsRouter.put('/clients/:id', clientController.updateClient);
clientsRouter.delete('/clients/:id', clientController.deleteClient);
