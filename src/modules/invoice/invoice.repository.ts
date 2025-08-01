import prisma from '../../config/prisma';
import { CreateInvoiceDto, UpdateInvoiceDto } from '../../types/invoice.types';

export const createInvoice = async (data: CreateInvoiceDto) =>
  await prisma.invoice.create({
    data: {
      invoiceReference: data.invoiceReference,
      description: data.description,
      status: data.status,
      invoiceDate: new Date(data.invoiceDate),
      dueDate: new Date(data.dueDate),
      totalAmount: data.invoiceItems.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      ),
      clientId: data.clientId,
      invoiceItems: {
        create: data.invoiceItems.map((item) => ({
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      },
    },
  });
  
export const getAllInvoices = async (
  page: string = '1',
  limit: string = '20',
  search: string = '',
  sort: string = 'desc',
) =>
  await prisma.invoice.findMany({
    include: {
      client: true,
    },
    skip: (parseInt(page) - 1) * parseInt(limit),
    take: parseInt(limit),
    where: {
      OR: [
        { invoiceReference: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    },
    orderBy: {
      invoiceDate: sort === 'asc' ? 'asc' : 'desc',
    },
  });

export const getInvoiceById = async (id: string) =>
  await prisma.invoice.findUnique({
    where: { id },
    include: {
      invoiceItems: true,
      client: true,
    },
  });

export const updateInvoice = async (id: string, data: UpdateInvoiceDto) =>
  await prisma.invoice.update({
    where: { id },
    data: {
      invoiceReference: data.invoiceReference,
      description: data.description,
      status: data.status,
      invoiceDate: data.invoiceDate ? new Date(data.invoiceDate) : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      totalAmount: data.invoiceItems?.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      ),
      invoiceItems: {
        deleteMany: {},
        create:
          data.invoiceItems?.map((item) => ({
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })) || [],
      },
    },
  });

export const deleteInvoice = async (id: string) =>
  await prisma.invoice.delete({
    where: { id },
  });
