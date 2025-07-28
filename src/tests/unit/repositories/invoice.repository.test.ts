import * as invoiceRepository from '../../../modules/invoice/invoice.repository';
import prisma from '../../../config/prisma';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  InvoiceStatus,
} from '../../../types/invoice.types';

jest.mock('../../../config/prisma', () => ({
  invoice: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

const mockCreateInvoiceDto: CreateInvoiceDto = {
  invoiceReference: 'INV-001',
  description: 'Test invoice',
  status: InvoiceStatus.PENDING,
  invoiceDate: '2024-01-15',
  dueDate: '2024-02-15',
  clientId: 'client-123',
  invoiceItems: [
    {
      name: 'Item 1',
      description: 'Test item 1',
      quantity: 2,
      unitPrice: 100,
    },
    {
      name: 'Item 2',
      description: 'Test item 2',
      quantity: 1,
      unitPrice: 50,
    },
  ],
};

const mockUpdateInvoiceDto: UpdateInvoiceDto = {
  invoiceReference: 'INV-001-UPDATED',
  description: 'Updated invoice',
  status: InvoiceStatus.PAID,
  invoiceItems: [
    {
      name: 'Updated Item',
      description: 'Updated test item',
      quantity: 3,
      unitPrice: 75,
    },
  ],
};

const mockInvoice = {
  id: 'invoice-123',
  invoiceReference: 'INV-001',
  description: 'Test invoice',
  status: InvoiceStatus.PENDING,
  invoiceDate: new Date('2024-01-15'),
  dueDate: new Date('2024-02-15'),
  totalAmount: 250,
  clientId: 'client-123',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Invoice Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createInvoice', () => {
    it('should create invoice with correct data and calculated total', async () => {
      (mockPrisma.invoice.create as jest.Mock).mockResolvedValue(mockInvoice);

      const result =
        await invoiceRepository.createInvoice(mockCreateInvoiceDto);

      expect(mockPrisma.invoice.create).toHaveBeenCalledWith({
        data: {
          invoiceReference: 'INV-001',
          description: 'Test invoice',
          status: InvoiceStatus.PENDING,
          invoiceDate: new Date('2024-01-15'),
          dueDate: new Date('2024-02-15'),
          totalAmount: 250, // (2 * 100) + (1 * 50)
          clientId: 'client-123',
          invoiceItems: {
            create: [
              {
                name: 'Item 1',
                description: 'Test item 1',
                quantity: 2,
                unitPrice: 100,
              },
              {
                name: 'Item 2',
                description: 'Test item 2',
                quantity: 1,
                unitPrice: 50,
              },
            ],
          },
        },
      });
      expect(result).toEqual(mockInvoice);
    });

    it('should handle empty invoice items', async () => {
      const invoiceWithoutItems = { ...mockCreateInvoiceDto, invoiceItems: [] };
      (mockPrisma.invoice.create as jest.Mock).mockResolvedValue(mockInvoice);

      await invoiceRepository.createInvoice(invoiceWithoutItems);

      expect(mockPrisma.invoice.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          totalAmount: 0,
          invoiceItems: { create: [] },
        }),
      });
    });

    it('should handle database errors', async () => {
      (mockPrisma.invoice.create as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        invoiceRepository.createInvoice(mockCreateInvoiceDto),
      ).rejects.toThrow('Database error');
    });
  });

  describe('getAllInvoices', () => {
    it('should return all invoices with client information', async () => {
      const mockInvoices = [
        {
          ...mockInvoice,
          client: { id: 'client-123', clientName: 'Test Client' },
        },
      ];
      (mockPrisma.invoice.findMany as jest.Mock).mockResolvedValue(
        mockInvoices,
      );

      const result = await invoiceRepository.getAllInvoices();

      expect(mockPrisma.invoice.findMany).toHaveBeenCalledWith({
        include: { client: true },
      });
      expect(result).toEqual(mockInvoices);
    });

    it('should return empty array when no invoices exist', async () => {
      (mockPrisma.invoice.findMany as jest.Mock).mockResolvedValue([]);

      const result = await invoiceRepository.getAllInvoices();

      expect(result).toEqual([]);
    });
  });

  describe('getInvoiceById', () => {
    it('should return invoice with items and client by id', async () => {
      const mockInvoiceWithDetails = {
        ...mockInvoice,
        invoiceItems: [
          { id: 'item-1', name: 'Item 1', quantity: 2, unitPrice: 100 },
        ],
        client: { id: 'client-123', clientName: 'Test Client' },
      };
      (mockPrisma.invoice.findUnique as jest.Mock).mockResolvedValue(
        mockInvoiceWithDetails,
      );

      const result = await invoiceRepository.getInvoiceById('invoice-123');

      expect(mockPrisma.invoice.findUnique).toHaveBeenCalledWith({
        where: { id: 'invoice-123' },
        include: {
          invoiceItems: true,
          client: true,
        },
      });
      expect(result).toEqual(mockInvoiceWithDetails);
    });

    it('should return null when invoice not found', async () => {
      (mockPrisma.invoice.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await invoiceRepository.getInvoiceById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('updateInvoice', () => {
    it('should update invoice with new data and recalculated total', async () => {
      const updatedInvoice = { ...mockInvoice, ...mockUpdateInvoiceDto };
      (mockPrisma.invoice.update as jest.Mock).mockResolvedValue(
        updatedInvoice,
      );

      const result = await invoiceRepository.updateInvoice(
        'invoice-123',
        mockUpdateInvoiceDto,
      );

      expect(mockPrisma.invoice.update).toHaveBeenCalledWith({
        where: { id: 'invoice-123' },
        data: {
          invoiceReference: 'INV-001-UPDATED',
          description: 'Updated invoice',
          status: InvoiceStatus.PAID,
          invoiceDate: undefined,
          dueDate: undefined,
          totalAmount: 225, // 3 * 75
          invoiceItems: {
            deleteMany: {},
            create: [
              {
                name: 'Updated Item',
                description: 'Updated test item',
                quantity: 3,
                unitPrice: 75,
              },
            ],
          },
        },
      });
      expect(result).toEqual(updatedInvoice);
    });

    it('should handle update with date fields', async () => {
      const updateWithDates = {
        ...mockUpdateInvoiceDto,
        invoiceDate: '2024-02-01',
        dueDate: '2024-03-01',
      };
      (mockPrisma.invoice.update as jest.Mock).mockResolvedValue(mockInvoice);

      await invoiceRepository.updateInvoice('invoice-123', updateWithDates);

      expect(mockPrisma.invoice.update).toHaveBeenCalledWith({
        where: { id: 'invoice-123' },
        data: expect.objectContaining({
          invoiceDate: new Date('2024-02-01'),
          dueDate: new Date('2024-03-01'),
        }),
      });
    });

    it('should handle update without invoice items', async () => {
      const updateWithoutItems = {
        ...mockUpdateInvoiceDto,
        invoiceItems: undefined,
      };
      (mockPrisma.invoice.update as jest.Mock).mockResolvedValue(mockInvoice);

      await invoiceRepository.updateInvoice('invoice-123', updateWithoutItems);

      expect(mockPrisma.invoice.update).toHaveBeenCalledWith({
        where: { id: 'invoice-123' },
        data: expect.objectContaining({
          totalAmount: undefined,
          invoiceItems: {
            deleteMany: {},
            create: [],
          },
        }),
      });
    });
  });

  describe('deleteInvoice', () => {
    it('should delete invoice by id', async () => {
      (mockPrisma.invoice.delete as jest.Mock).mockResolvedValue(mockInvoice);

      const result = await invoiceRepository.deleteInvoice('invoice-123');

      expect(mockPrisma.invoice.delete).toHaveBeenCalledWith({
        where: { id: 'invoice-123' },
      });
      expect(result).toEqual(mockInvoice);
    });

    it('should handle delete errors', async () => {
      (mockPrisma.invoice.delete as jest.Mock).mockRejectedValue(
        new Error('Invoice not found'),
      );

      await expect(
        invoiceRepository.deleteInvoice('non-existent'),
      ).rejects.toThrow('Invoice not found');
    });
  });
});
