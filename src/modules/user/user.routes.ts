import { Router } from 'express';
import * as userController from './user.controller';
import { validationMiddleware } from '../../middleware/validation.middleware';
import { CreateUserSchema } from '../../types/user.schema';
import { UpdateInvoiceDtoSchema } from '../../types/invoice.schema';

export const clientsRouter = Router();
clientsRouter.post(
  '/users',
  validationMiddleware(CreateUserSchema),
  userController.createUser,
);
clientsRouter.get('/users', userController.getAllUsers);
clientsRouter.get(
  '/users/:id',
  validationMiddleware(UpdateInvoiceDtoSchema),
  userController.getUserById,
);
clientsRouter.put('/users/:id', userController.updateUser);
clientsRouter.delete('/users/:id', userController.deleteUser);
