import { HttpStatus } from "../enums/http-status.enum";
import { AppError } from "./AppError";

export class ClientNotFoundError extends AppError {
  constructor(clientId: string) {
    super(`Client with ID ${clientId} not found`, HttpStatus.NOT_FOUND);
  }
}