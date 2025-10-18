import prisma from "../config/prisma";

export const generateInvoiceReference = async (): Promise<string> => {
  const currentYear = new Date().getFullYear();
  const prefix = `INV-${currentYear}-`;
  
  const latestInvoice = await prisma.invoice.findFirst({
    where: {
      invoiceReference: {
        startsWith: prefix,
      },
    },
    orderBy: {
      invoiceReference: 'desc',
    },
  });

  let nextNumber = 1;
  if (latestInvoice) {
    const currentNumber = parseInt(latestInvoice.invoiceReference.split('-').pop() || '0');
    nextNumber = currentNumber + 1;
  }

  const paddedNumber = nextNumber.toString().padStart(4, '0');
  return `${prefix}${paddedNumber}`;
};