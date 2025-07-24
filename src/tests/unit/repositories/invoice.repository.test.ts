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
import { InvoiceStatus } from '../../../types/invoice.types';
import { mock } from 'node:test';

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
      aggregate: jest.fn(),
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
          clientId: mockCreateInvoiceDto.clientId,
          totalAmount: mockCreateInvoiceDto.totalAmount,
          invoiceItems: {
            create: mockCreateInvoiceDto.invoiceItems.map((item) => ({
              name: item.name,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
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
      ).rejects.toThrow(prismaError);
    });

    it('should handle Prisma error for invalid client reference', async () => {
      const prismaError = {
        ...mockPrismaErrors.invalidClientReference,
        name: 'PrismaClientKnownRequestError',
      };
      (mockPrisma.invoice.create as jest.Mock).mockRejectedValue(prismaError);

      await expect(
        invoiceRepository.createInvoice(mockCreateInvoiceDto),
      ).rejects.toThrow(prismaError);
    });

    it('should create invoice without invoiceItems', async () => {
      const invoiceWithoutItems = {
        ...mockCreateInvoiceDto,
        invoiceItems: [],
        totalAmount: 0,
      };
      const expectedInvoice = {
        ...mockInvoice,
        invoiceItems: [],
        totalAmount: 0,
      };
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
          totalAmount: invoiceWithoutItems.totalAmount,
          clientId: invoiceWithoutItems.clientId,
          invoiceItems: {
            create: [],
          },
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
          client: true,
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
          client: true,
          invoiceItems: true,
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
          client: true,
          invoiceItems: true,
        },
      });
      expect(result).toBeNull();
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
          invoiceDate: new Date(mockUpdateInvoiceDto.invoiceDate ?? Date.now()),
          dueDate: new Date(mockUpdateInvoiceDto.dueDate ?? Date.now()),
          totalAmount: mockUpdateInvoiceDto.totalAmount,
          invoiceItems: {
            deleteMany: {},
            create: (mockUpdateInvoiceDto.invoiceItems || []).map((item) => ({
              name: item.name,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
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
      ).rejects.toThrow(prismaError);
    });
  });

  describe('deleteInvoice', () => {
    it('should delete invoice successfully', async () => {
      (mockPrisma.invoice.delete as jest.Mock).mockResolvedValue(mockInvoice);

      const result = await invoiceRepository.deleteInvoice('invoice-123');

      expect(mockPrisma.invoice.delete).toHaveBeenCalledWith({
        where: { id: 'invoice-123' },
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
      ).rejects.toThrow(prismaError);
    });
  });

  describe('countInvoices', () => {
    it('should return total count of invoices', async () => {
      (mockPrisma.invoice.count as jest.Mock).mockResolvedValue(3);

      const result = await invoiceRepository.countInvoices();

      expect(mockPrisma.invoice.count).toHaveBeenCalled();
      expect(result).toBe(3);
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

    it('should handle database connection error', async () => {
      const dbError = new Error('Database connection failed');
      (mockPrisma.invoice.aggregate as jest.Mock).mockRejectedValue(dbError);

      await expect(invoiceRepository.getTotalAmountUnpaid()).rejects.toThrow(
        dbError,
      );
    });
  });
});
