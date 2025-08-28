import * as clientService from './client.service';
import { Request, Response, NextFunction } from 'express';
import { CreateClientDto, UpdateClientDto } from '../../types/client.types';
import { HttpStatus } from '../../enums/http-status.enum';

export const createClient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: CreateClientDto = req.body;
    const client = await clientService.createClient(data);
    res.status(HttpStatus.CREATED).json(client);
  } catch (error) {
    next(error);
  }
};

export const getAllClients = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const clients = await clientService.getAllClients();
    res.status(HttpStatus.OK).json(clients);
  } catch (error) {
    next(error);
  }
};

export const getClientById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { clientId } = req.params;
    console.log("Fetching client with ID:", clientId); // Debugging log
    const client = await clientService.getClientById(clientId);
    res.status(HttpStatus.OK).json(client);
  } catch (error) {
    next(error);
  }
};

export const updateClient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { clientId } = req.params;
    const data: UpdateClientDto = req.body;
    const client = await clientService.updateClient(clientId, data);
    res.status(HttpStatus.OK).json(client);
  } catch (error) {
    next(error);
  }
};

export const deleteClient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { clientId } = req.params;
    await clientService.deleteClient(clientId);
    res.status(HttpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};
