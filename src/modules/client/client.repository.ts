import prisma from '../../config/prisma';
import { errorHandler } from '../../handlers/errorHandler';
import { CreateClientDto, UpdateClientDto } from '../../types/client.types';

export const createClient = async (data: CreateClientDto) => {
  try {
    return await prisma.client.create({
      data: {
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        clientAddress: {
          create: {
            street: data.clientAddress.street,
            city: data.clientAddress.city,
            country: data.clientAddress.country,
            postalCode: data.clientAddress.postalCode,
          },
        },
      },
      include: {
        clientAddress: true,
      },
    });
  } catch (error) {
    errorHandler(error);
  }
};

export const getAllClients = async () => {
  try {
    return await prisma.client.findMany({
      include: {
        clientAddress: true,
      },
    });
  } catch (error) {
    errorHandler(error);
  }
};

export const getClientById = async (id: string) => {
  try {
    return await prisma.client.findUnique({
      where: { id },
      include: {
        clientAddress: true,
        invoices: true,
      },
    });
  } catch (error) {
    errorHandler(error);
  }
};

export const updateClient = async (id: string, data: UpdateClientDto) => {
  try {
    return await prisma.client.update({
      where: { id },
      data: {
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        clientAddress: {
          update: {
            where: { id: data.clientAddress.id },
            data: {
              street: data.clientAddress?.street,
              city: data.clientAddress?.city,
              country: data.clientAddress?.country,
              postalCode: data.clientAddress?.postalCode,
            },
          },
        },
      },
    });
  } catch (error) {
    console.log('Error updating user:', error);
    errorHandler(error);
  }
};

export const deleteClient = async (id: string) => {
  try {
    return await prisma.client.delete({
      where: { id },
    });
  } catch (error) {
    errorHandler(error);
  }
};
