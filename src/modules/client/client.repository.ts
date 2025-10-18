import prisma from '../../config/prisma';
import { errorHandler } from '../../handlers/errorHandler';
import { CreateClientDto, UpdateClientDto } from '../../types/client.types';

export const createClient = async (data: CreateClientDto) =>
  await prisma.client.create({
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

export const getAllClients = async (
  page: string = '1',
  limit: string = '20',
  search: string = '',
  sort: 'asc' | 'desc' = 'asc',
) => {
  // Validate and sanitize parameters
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;
  const searchTerm = search || '';
  const sortOrder = ['asc', 'desc'].includes(sort) ? sort : 'asc';

  // Ensure valid pagination values
  const validPage = Math.max(1, pageNum);
  const validLimit = Math.min(Math.max(1, limitNum), 100); // Cap at 100

  return prisma.client.findMany({
    include: {
      clientAddress: true,
    },
    skip: (validPage - 1) * validLimit,
    take: validLimit,
    where: {
      clientName: {
        contains: searchTerm,
        mode: 'insensitive',
      },
    },
    orderBy: {
      clientName: sortOrder,
    },
  });
};

export const getClientById = async (id: string) =>
  await prisma.client.findUnique({
    where: { id },
    include: {
      clientAddress: true,
      invoices: true,
    },
  });

export const updateClient = async (id: string, data: UpdateClientDto) =>
  await prisma.client.update({
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

export const deleteClient = async (id: string) =>
  await prisma.client.delete({
    where: { id },
  });
