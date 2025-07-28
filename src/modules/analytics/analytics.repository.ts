import prisma from "../../config/prisma";
import { InvoiceStatus } from "../../types/invoice.types";

export const countInvoices = async () => await prisma.invoice.count();

export const getClientCount = async () => await prisma.client.count();

export const getTotalAmount = async () => await prisma.invoice.aggregate({
    _sum: {
        totalAmount: true,
    },
}) || 0

export const getTotalAmountUnpaid = async () => await prisma.invoice.aggregate({
    _sum: {
        totalAmount: true,
    },
    where: {
        status: InvoiceStatus.OVERDUE,
    },
});