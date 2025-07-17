import prisma from '../../config/prisma';
import { CreateInvoiceDto, UpdateInvoiceDto } from '../../types/invoice.types';

export const createInvoice = async (data: CreateInvoiceDto) =>
  await prisma.invoice.create({
    data: {
      invoiceReference: data.invoiceReference,
      status: data.status,
      invoiceDate: new Date(data.invoiceDate),
      dueDate: new Date(data.dueDate),
      totalAmount: data.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      ),
      userId: data.userId,
      invoiceItems: {
        create: data.items.map((item) => ({
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      },
    },
  });

export const getAllInvoices = async () =>
  await prisma.invoice.findMany({
    include: {
      invoiceItems: true,
    },
  });

export const getInvoiceById = async (id: string) =>
  await prisma.invoice.findUnique({
    where: { id },
    include: {
      invoiceItems: true,
    },
  });

export const updateInvoice = async (id: string, data: UpdateInvoiceDto) =>
  await prisma.invoice.update({
    where: { id },
    data: {
      invoiceReference: data.invoiceReference,
      status: data.status,
      invoiceDate: data.invoiceDate ? new Date(data.invoiceDate) : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      totalAmount: data.items?.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      ),
      invoiceItems: {
        deleteMany: {},
        create:
          data.items?.map((item) => ({
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
