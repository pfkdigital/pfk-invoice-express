import { InvoiceStatus } from '../../../generated/prisma';
import prisma from '../../config/prisma';
import { errorHandler } from '../../handlers/errorHandler';
import { CreateInvoiceDto, UpdateInvoiceDto } from '../../types/invoice.types';

export const createInvoice = async (data: CreateInvoiceDto) => {
  try {
    return await prisma.invoice.create({
      data: {
        invoiceReference: data.invoiceReference,
        description: data.description,
        status: data.status,
        invoiceDate: new Date(data.invoiceDate),
        dueDate: new Date(data.dueDate),
        totalAmount: data.items.reduce(
          (sum, item) => sum + item.quantity * item.unitPrice,
          0,
        ),
        clientId: data.clientId,
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
  } catch (error) {
    errorHandler(error);
  }
};

export const getAllInvoices = async () => {
  try {
    return await prisma.invoice.findMany({
      include: {
        client: true,
      },
    });
  } catch (error) {
    errorHandler(error);
  }
};

export const getInvoiceById = async (id: string) => {
  try {
    return await prisma.invoice.findUnique({
      where: { id },
      include: {
        invoiceItems: true,
        client: true,
      },
    });
  } catch (error) {
    errorHandler(error);
  }
};

export const updateInvoice = async (id: string, data: UpdateInvoiceDto) => {
  try {
    return await prisma.invoice.update({
      where: { id },
      data: {
        invoiceReference: data.invoiceReference,
        description: data.description,
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
  } catch (error) {
    errorHandler(error);
  }
};

export const deleteInvoice = async (id: string) => {
  try {
    return await prisma.invoice.delete({
      where: { id },
    });
  } catch (error) {
    errorHandler(error);
  }
};

export const countInvoices = async () => {
  try {
    return await prisma.invoice.count();
  } catch (error) {
    errorHandler(error);
  }
};

export const getTotalAmount = async () => {
  try {
    const result = await prisma.invoice.aggregate({
      _sum: {
        totalAmount: true,
      },
    });
    return result._sum.totalAmount || 0;
  } catch (error) {
    errorHandler(error);
  }
};

export const getTotalAmountUnpaid = async () => {
  try {
    const result = await prisma.invoice.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        status: InvoiceStatus.OVERDUE,
      },
    });
    return result._sum.totalAmount || 0;
  } catch (error) {
    errorHandler(error);
  }
};
