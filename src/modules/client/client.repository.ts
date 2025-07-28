import prisma from '../../config/prisma';
import { errorHandler } from '../../handlers/errorHandler';
import { CreateClientDto, UpdateClientDto } from '../../types/client.types';

export const createClient = async (data: CreateClientDto) => await prisma.client.create({
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

export const getAllClients = async () => await prisma.client.findMany({
  include: {
    clientAddress: true,
  },
});

export const getClientById = async (id: string) => await prisma.client.findUnique({
  where: { id },
  include: {
    clientAddress: true,
    invoices: true,
  },
});

export const updateClient = async (id: string, data: UpdateClientDto) => await prisma.client.update({
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

export const deleteClient = async (id: string) => await prisma.client.delete({
  where: { id },
});
