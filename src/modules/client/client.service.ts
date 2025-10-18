import { CreateClientDto, UpdateClientDto } from '../../types/client.types';
import * as clientRepository from './client.repository';
import { ClientNotFoundError } from '../../errors/ClientNotFoundError';
import { errorHandler } from '../../handlers/errorHandler';

export const createClient = async (data: CreateClientDto) => {
  try {
    return await clientRepository.createClient(data);
  } catch (error) {
    errorHandler(error);
  }
};

export const getAllClients = async (
  page: string,
  limit: string,
  search: string,
  sort: 'asc' | 'desc',
) => {
  try {
    return await clientRepository.getAllClients(page, limit, search, sort);
  } catch (error) {
    errorHandler(error);
  }
};

export const getClientById = async (id: string) => {
  try {
    const client = await clientRepository.getClientById(id);
    if (!client) {
      throw new ClientNotFoundError(id);
    }
    return client;
  } catch (error) {
    errorHandler(error);
  }
};

export const updateClient = async (id: string, data: UpdateClientDto) => {
  try {
    const client = await clientRepository.getClientById(id);
    if (!client) {
      throw new ClientNotFoundError(id);
    }
    return await clientRepository.updateClient(id, data);
  } catch (error) {
    errorHandler(error);
  }
};

export const deleteClient = async (id: string) => {
  try {
    const client = await clientRepository.getClientById(id);
    if (!client) {
      throw new ClientNotFoundError(id);
    }
    return await clientRepository.deleteClient(id);
  } catch (error) {
    errorHandler(error);
  }
};
