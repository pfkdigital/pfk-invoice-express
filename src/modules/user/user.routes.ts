import { Router } from "express";
import * as userController from "./user.controller";
import { validationHandler } from "../../handlers/validationHandler";
import { CreateUserSchema } from "../../types/user.schema";
import { UpdateInvoiceDtoSchema } from "../../types/invoice.schema";

export const clientsRouter = Router();
clientsRouter.post(
  "/users",
  validationHandler(CreateUserSchema),
  userController.createUser
);
clientsRouter.get("/users", userController.getAllUsers);
clientsRouter.get(
  "/users/:id",
  validationHandler(UpdateInvoiceDtoSchema),
  userController.getUserById
);
clientsRouter.put("/users/:id", userController.updateUser);
clientsRouter.delete("/users/:id", userController.deleteUser);
