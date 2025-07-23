import prisma from '../../../config/prisma';
import * as invoiceRepository from '../../../modules/invoice/invoice.repository';
import {
  mockCreateInvoiceDto,
  mockUpdateInvoiceDto,
  mockInvoice,
  mockInvoices,
  mockInvoiceWithoutClient,
  mockUpdatedInvoice,
  mockEmptyInvoices,
  mockPrismaErrors,
} from '../../mocks/invoice.mock';
import { PrismaError } from '../../../errors/PrismaError';
import { InvoiceStatus } from '../../../types/invoice.types';

jest.mock('../../../config/prisma', () => ({
  __esModule: true,
  default: {
    invoice: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Invoice Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createInvoice', () => {
    it('should create an invoice successfully', async () => {
      (mockPrisma.invoice.create as jest.Mock).mockResolvedValue(mockInvoice);

      const result =
        await invoiceRepository.createInvoice(mockCreateInvoiceDto);

      expect(mockPrisma.invoice.create).toHaveBeenCalledWith({
        data: {
          invoiceReference: mockCreateInvoiceDto.invoiceReference,
          description: mockCreateInvoiceDto.description,
          status: mockCreateInvoiceDto.status,
          invoiceDate: new Date(mockCreateInvoiceDto.invoiceDate),
          dueDate: new Date(mockCreateInvoiceDto.dueDate),
          amount: mockCreateInvoiceDto.amount,
          clientId: mockCreateInvoiceDto.clientId,
          invoiceItems: {
            create: mockCreateInvoiceDto.items.map((item) => ({
              name: item.name,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
          totalAmount: mockCreateInvoiceDto.amount,
        include: {
          client: {
            include: {
              clientAddress: true,
            },
          },
          invoiceItems: true,
        },
        },
      });
      expect(result).toEqual(mockInvoice);
    });

    it('should handle Prisma error for duplicate invoice reference', async () => {
      const prismaError = {
        ...mockPrismaErrors.duplicateInvoiceReference,
        name: 'PrismaClientKnownRequestError',
      };
      (mockPrisma.invoice.create as jest.Mock).mockRejectedValue(prismaError);

      await expect(
        invoiceRepository.createInvoice(mockCreateInvoiceDto),
      ).rejects.toThrow(PrismaError);
    });

    it('should handle Prisma error for invalid client reference', async () => {
      const prismaError = {
        ...mockPrismaErrors.invalidClientReference,
        name: 'PrismaClientKnownRequestError',
      };
      (mockPrisma.invoice.create as jest.Mock).mockRejectedValue(prismaError);

      await expect(
        invoiceRepository.createInvoice(mockCreateInvoiceDto),
      ).rejects.toThrow(PrismaError);
    });

    it('should create invoice without items', async () => {
      const invoiceWithoutItems = { ...mockCreateInvoiceDto, items: [] };
      const expectedInvoice = { ...mockInvoice, items: [] };
      (mockPrisma.invoice.create as jest.Mock).mockResolvedValue(
        expectedInvoice,
      );

      const result = await invoiceRepository.createInvoice(invoiceWithoutItems);

      expect(mockPrisma.invoice.create).toHaveBeenCalledWith({
        data: {
          invoiceReference: invoiceWithoutItems.invoiceReference,
          description: invoiceWithoutItems.description,
          status: invoiceWithoutItems.status,
          invoiceDate: new Date(invoiceWithoutItems.invoiceDate),
          dueDate: new Date(invoiceWithoutItems.dueDate),
          amount: invoiceWithoutItems.amount,
          clientId: invoiceWithoutItems.clientId,
          items: {
            create: [],
          },
        },
        include: {
          client: {
            include: {
              clientAddress: true,
            },
          },
          items: true,
        },
      });
      expect(result).toEqual(expectedInvoice);
    });
  });

  describe('getAllInvoices', () => {
    it('should return all invoices successfully', async () => {
      (mockPrisma.invoice.findMany as jest.Mock).mockResolvedValue(
        mockInvoices,
      );

      const result = await invoiceRepository.getAllInvoices();

      expect(mockPrisma.invoice.findMany).toHaveBeenCalledWith({
        include: {
          client: {
            include: {
              clientAddress: true,
            },
          },
          items: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result).toEqual(mockInvoices);
    });

    it('should return empty array when no invoices exist', async () => {
      (mockPrisma.invoice.findMany as jest.Mock).mockResolvedValue(
        mockEmptyInvoices,
      );

      const result = await invoiceRepository.getAllInvoices();

      expect(result).toEqual(mockEmptyInvoices);
    });

    it('should handle database connection error', async () => {
      const dbError = new Error('Database connection failed');
      (mockPrisma.invoice.findMany as jest.Mock).mockRejectedValue(dbError);

      await expect(invoiceRepository.getAllInvoices()).rejects.toThrow(dbError);
    });
  });

  describe('getInvoiceById', () => {
    it('should return invoice when found', async () => {
      (mockPrisma.invoice.findUnique as jest.Mock).mockResolvedValue(
        mockInvoice,
      );

      const result = await invoiceRepository.getInvoiceById('invoice-123');

      expect(mockPrisma.invoice.findUnique).toHaveBeenCalledWith({
        where: { id: 'invoice-123' },
        include: {
          client: {
            include: {
              clientAddress: true,
            },
          },
          items: true,
        },
      });
      expect(result).toEqual(mockInvoice);
    });

    it('should return null when invoice not found', async () => {
      (mockPrisma.invoice.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await invoiceRepository.getInvoiceById('non-existent-id');

      expect(mockPrisma.invoice.findUnique).toHaveBeenCalledWith({
        where: { id: 'non-existent-id' },
        include: {
          client: {
            include: {
              clientAddress: true,
            },
          },
          items: true,
        },
      });
      expect(result).toBeNull();
    });

    it('should return invoice without client data when include is false', async () => {
      (mockPrisma.invoice.findUnique as jest.Mock).mockResolvedValue(
        mockInvoiceWithoutClient,
      );

      const result = await invoiceRepository.getInvoiceById('invoice-123');

      expect(mockPrisma.invoice.findUnique).toHaveBeenCalledWith({
        where: { id: 'invoice-123' },
        include: {
          items: true,
        },
      });
      expect(result).toEqual(mockInvoiceWithoutClient);
    });
  });

  describe('updateInvoice', () => {
    it('should update invoice successfully', async () => {
      (mockPrisma.invoice.update as jest.Mock).mockResolvedValue(
        mockUpdatedInvoice,
      );

      const result = await invoiceRepository.updateInvoice(
        'invoice-123',
        mockUpdateInvoiceDto,
      );

      expect(mockPrisma.invoice.update).toHaveBeenCalledWith({
        where: { id: 'invoice-123' },
        data: {
          invoiceReference: mockUpdateInvoiceDto.invoiceReference,
          description: mockUpdateInvoiceDto.description,
          status: mockUpdateInvoiceDto.status,
          invoiceDate: mockUpdateInvoiceDto.invoiceDate,
          dueDate: mockUpdateInvoiceDto.dueDate,
          amount: mockUpdateInvoiceDto.amount,
          clientId: mockUpdateInvoiceDto.clientId,
          items: {
            deleteMany: {},
            create: (mockUpdateInvoiceDto.items || []).map((item) => ({
              name: item.name,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
        include: {
          client: {
            include: {
              clientAddress: true,
            },
          },
          items: true,
        },
      });
      expect(result).toEqual(mockUpdatedInvoice);
    });

    it('should handle Prisma error when invoice not found', async () => {
      const prismaError = {
        ...mockPrismaErrors.invoiceNotFound,
        name: 'PrismaClientKnownRequestError',
      };
      (mockPrisma.invoice.update as jest.Mock).mockRejectedValue(prismaError);

      await expect(
        invoiceRepository.updateInvoice(
          'non-existent-id',
          mockUpdateInvoiceDto,
        ),
      ).rejects.toThrow(PrismaError);
    });

    it('should update invoice with partial data', async () => {
      const partialUpdate = {
        status: InvoiceStatus.PAID,
        amount: 2000,
        description: 'Updated description',
      };
      const partialUpdatedInvoice = { ...mockInvoice, ...partialUpdate };
      (mockPrisma.invoice.update as jest.Mock).mockResolvedValue(
        partialUpdatedInvoice,
      );

      const result = await invoiceRepository.updateInvoice(
        'invoice-123',
        partialUpdate,
      );

      expect(mockPrisma.invoice.update).toHaveBeenCalledWith({
        where: { id: 'invoice-123' },
        data: partialUpdate,
        include: {
          client: {
            include: {
              clientAddress: true,
            },
          },
          items: true,
        },
      });
      expect(result).toEqual(partialUpdatedInvoice);
    });
  });

  describe('deleteInvoice', () => {
    it('should delete invoice successfully', async () => {
      (mockPrisma.invoice.delete as jest.Mock).mockResolvedValue(mockInvoice);

      const result = await invoiceRepository.deleteInvoice('invoice-123');

      expect(mockPrisma.invoice.delete).toHaveBeenCalledWith({
        where: { id: 'invoice-123' },
        include: {
          client: {
            include: {
              clientAddress: true,
            },
          },
          items: true,
        },
      });
      expect(result).toEqual(mockInvoice);
    });

    it('should handle Prisma error when invoice not found', async () => {
      const prismaError = {
        ...mockPrismaErrors.invoiceNotFound,
        name: 'PrismaClientKnownRequestError',
      };
      (mockPrisma.invoice.delete as jest.Mock).mockRejectedValue(prismaError);

      await expect(
        invoiceRepository.deleteInvoice('non-existent-id'),
      ).rejects.toThrow(PrismaError);
    });
  });

  describe('countInvoices', () => {
    it('should return total count of invoices', async () => {
      (mockPrisma.invoice.count as jest.Mock).mockResolvedValue(3);

      const result = await invoiceRepository.countInvoices();

      expect(mockPrisma.invoice.count).toHaveBeenCalled();
      expect(result).toBe(3);
    });

    it('should return count with filters', async () => {
      (mockPrisma.invoice.count as jest.Mock).mockResolvedValue(2);

      const result = await invoiceRepository.countInvoices();

      expect(mockPrisma.invoice.count).toHaveBeenCalledWith({
        where: { status: InvoiceStatus.PENDING },
      });
      expect(result).toBe(2);
    });
  });
  describe('getTotalAmount', () => {
    it('should return total amount of all invoices', async () => {
      (mockPrisma.invoice.aggregate as jest.Mock).mockResolvedValue({
        _sum: { totalAmount: 5000 },
      });

      const result = await invoiceRepository.getTotalAmount();

      expect(mockPrisma.invoice.aggregate).toHaveBeenCalledWith({
        _sum: { totalAmount: true },
      });
      expect(result).toBe(5000);
    });

    it('should return zero if no invoices exist', async () => {
      (mockPrisma.invoice.aggregate as jest.Mock).mockResolvedValue({
        _sum: { totalAmount: null },
      });

      const result = await invoiceRepository.getTotalAmount();

      expect(result).toBe(0);
    });
  });
  describe('getTotalAmountUnpaid', () => {
    it('should return total amount of unpaid invoices', async () => {
      (mockPrisma.invoice.aggregate as jest.Mock).mockResolvedValue({
        _sum: { totalAmount: 3000 },
      });

      const result = await invoiceRepository.getTotalAmountUnpaid();

      expect(mockPrisma.invoice.aggregate).toHaveBeenCalledWith({
        _sum: { totalAmount: true },
        where: { status: InvoiceStatus.OVERDUE },
      });
      expect(result).toBe(3000);
    });

    it('should return zero if no unpaid invoices exist', async () => {
      (mockPrisma.invoice.aggregate as jest.Mock).mockResolvedValue({
        _sum: { totalAmount: null },
      });

      const result = await invoiceRepository.getTotalAmountUnpaid();

      expect(result).toBe(0);
    });

    describe('getTotalAmountUnpaid', () => {
      it('should return total amount of unpaid invoices', async () => {
        (mockPrisma.invoice.aggregate as jest.Mock).mockResolvedValue({
          _sum: { totalAmount: 3000 },
        });

        const result = await invoiceRepository.getTotalAmountUnpaid();

        expect(mockPrisma.invoice.aggregate).toHaveBeenCalledWith({
          _sum: { totalAmount: true },
          where: { status: InvoiceStatus.OVERDUE },
        });
        expect(result).toBe(3000);
      });

      it('should return zero if no unpaid invoices exist', async () => {
        (mockPrisma.invoice.aggregate as jest.Mock).mockResolvedValue({
          _sum: { totalAmount: null },
        });

        const result = await invoiceRepository.getTotalAmountUnpaid();

        expect(result).toBe(0);
      });

      it('should handle database connection error', async () => {
        const dbError = new Error('Database connection failed');
        (mockPrisma.invoice.aggregate as jest.Mock).mockRejectedValue(dbError);

        await expect(invoiceRepository.getTotalAmountUnpaid()).rejects.toThrow(dbError);
      });
    });
  });
});
