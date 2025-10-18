import * as clientService from './client.service';
import { Request, Response, NextFunction } from 'express';
import {
  CreateClientDto,
  UpdateClientDto,
} from '../../types/client.types';
import { HttpStatus } from '../../enums/http-status.enum';
import { Queries } from '../../types/invoice.types';

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
    const { search, sort, page, limit } = req.query as Queries;

    const clients = await clientService.getAllClients(
      page,
      limit,
      search || '',
      sort || 'asc',
    );

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
