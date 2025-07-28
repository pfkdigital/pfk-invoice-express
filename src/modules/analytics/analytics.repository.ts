import prisma from "../../config/prisma";
import { InvoiceStatus } from "../../types/invoice.types";

export const countInvoices = async () => await prisma.invoice.count();

export const getClientCount = async () => await prisma.client.count();

export const getTotalAmount = async () => {
    const result = await prisma.invoice.aggregate({
        _sum: {
            totalAmount: true,
        },
    });
    return result._sum.totalAmount || 0;
}

export const getTotalAmountUnpaid = async () => {
    const result = await prisma.invoice.aggregate({
        _sum: {
            totalAmount: true,
        },
        where: {
            status: InvoiceStatus.OVERDUE,
        },
    });
    return result._sum.totalAmount || 0;
}
