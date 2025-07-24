import * as invoiceService from '../../../modules/invoice/invoice.service';
import * as invoiceRepository from '../../../modules/invoice/invoice.repository';
import { AppError } from '../../../errors/AppError';
import { HttpStatus } from '../../../enums/http-status.enum';
import { errorHandler } from '../../../handlers/errorHandler';
import {
  mockCreateInvoiceDto,
  mockUpdateInvoiceDto,
  mockInvoice,
  mockInvoices,
  mockUpdatedInvoice,
} from '../../mocks/invoice.mock';

jest.mock('../../../modules/invoice/invoice.repository');
jest.mock('../../../handlers/errorHandler');

const mockInvoiceRepository = invoiceRepository as jest.Mocked<typeof invoiceRepository>;
jest.mock('../../../handlers/errorHandler', () => ({
  errorHandler: jest.fn(),
}));
const mockErrorHandler = errorHandler as jest.MockedFunction<typeof errorHandler>;

describe('Invoice Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createInvoice', () => {
    it('should create an invoice successfully', async () => {
      (mockInvoiceRepository.createInvoice as jest.Mock).mockResolvedValue(mockInvoice);

      const result = await invoiceService.createInvoice(mockCreateInvoiceDto);

      expect(mockInvoiceRepository.createInvoice).toHaveBeenCalledWith(mockCreateInvoiceDto);
      expect(result).toEqual(mockInvoice);
    });

    it('should handle error during invoice creation', async () => {
      const error = new Error('Database error');
      (mockInvoiceRepository.createInvoice as jest.Mock).mockRejectedValue(error);

      await invoiceService.createInvoice(mockCreateInvoiceDto);

      expect(mockErrorHandler).toHaveBeenCalledWith(error);
    });

    it('should handle Prisma errors during invoice creation', async () => {
      const prismaError = new Error('Unique constraint violation');
      (mockInvoiceRepository.createInvoice as jest.Mock).mockRejectedValue(prismaError);

      await invoiceService.createInvoice(mockCreateInvoiceDto);

      expect(mockErrorHandler).toHaveBeenCalledWith(prismaError);
    });
  });

  describe('getAllInvoices', () => {
    it('should return all invoices successfully', async () => {
      (mockInvoiceRepository.getAllInvoices as jest.Mock).mockResolvedValue(mockInvoices);

      const result = await invoiceService.getAllInvoices();

      expect(mockInvoiceRepository.getAllInvoices).toHaveBeenCalled();
      expect(result).toEqual(mockInvoices);
    });

    it('should return empty array when no invoices exist', async () => {
      (mockInvoiceRepository.getAllInvoices as jest.Mock).mockResolvedValue([]);

      const result = await invoiceService.getAllInvoices();

      expect(result).toEqual([]);
    });

    it('should handle error during fetching all invoices', async () => {
      const error = new Error('Database connection failed');
      (mockInvoiceRepository.getAllInvoices as jest.Mock).mockRejectedValue(error);

      await invoiceService.getAllInvoices();

      expect(mockErrorHandler).toHaveBeenCalledWith(error);
    });
  });

  describe('getInvoiceById', () => {
    it('should return invoice when found', async () => {
      (mockInvoiceRepository.getInvoiceById as jest.Mock).mockResolvedValue(mockInvoice);

      const result = await invoiceService.getInvoiceById('invoice-123');

      expect(mockInvoiceRepository.getInvoiceById).toHaveBeenCalledWith('invoice-123');
      expect(result).toEqual(mockInvoice);
    });

    it('should throw AppError when invoice not found', async () => {
      (mockInvoiceRepository.getInvoiceById as jest.Mock).mockResolvedValue(null);

      await invoiceService.getInvoiceById('non-existent-id');

      expect(mockErrorHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invoice not found',
          statusCode: HttpStatus.NOT_FOUND,
        })
      );
    });

    it('should handle database error during fetch', async () => {
      const error = new Error('Database connection failed');
      (mockInvoiceRepository.getInvoiceById as jest.Mock).mockRejectedValue(error);

      await invoiceService.getInvoiceById('invoice-123');

      expect(mockErrorHandler).toHaveBeenCalledWith(error);
    });
  });

  describe('updateInvoice', () => {
    it('should update invoice successfully when invoice exists', async () => {
      (mockInvoiceRepository.getInvoiceById as jest.Mock).mockResolvedValue(mockInvoice);
      (mockInvoiceRepository.updateInvoice as jest.Mock).mockResolvedValue(mockUpdatedInvoice);

      const result = await invoiceService.updateInvoice('invoice-123', mockUpdateInvoiceDto);

      expect(mockInvoiceRepository.getInvoiceById).toHaveBeenCalledWith('invoice-123');
      expect(mockInvoiceRepository.updateInvoice).toHaveBeenCalledWith('invoice-123', mockUpdateInvoiceDto);
      expect(result).toEqual(mockUpdatedInvoice);
    });

    it('should throw AppError when invoice not found for update', async () => {
      (mockInvoiceRepository.getInvoiceById as jest.Mock).mockResolvedValue(null);

      await invoiceService.updateInvoice('non-existent-id', mockUpdateInvoiceDto);

      expect(mockInvoiceRepository.getInvoiceById).toHaveBeenCalledWith('non-existent-id');
      expect(mockInvoiceRepository.updateInvoice).not.toHaveBeenCalled();
      expect(mockErrorHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invoice not found',
          statusCode: HttpStatus.NOT_FOUND,
        })
      );
    });

    it('should handle error during invoice update', async () => {
      (mockInvoiceRepository.getInvoiceById as jest.Mock).mockResolvedValue(mockInvoice);
      const error = new Error('Update failed');
      (mockInvoiceRepository.updateInvoice as jest.Mock).mockRejectedValue(error);

      await invoiceService.updateInvoice('invoice-123', mockUpdateInvoiceDto);

      expect(mockErrorHandler).toHaveBeenCalledWith(error);
    });

    it('should handle error during existence check for update', async () => {
      const error = new Error('Database connection failed');
      (mockInvoiceRepository.getInvoiceById as jest.Mock).mockRejectedValue(error);

      await invoiceService.updateInvoice('invoice-123', mockUpdateInvoiceDto);

      expect(mockErrorHandler).toHaveBeenCalledWith(error);
      expect(mockInvoiceRepository.updateInvoice).not.toHaveBeenCalled();
    });
  });

  describe('deleteInvoice', () => {
    it('should delete invoice successfully when invoice exists', async () => {
      (mockInvoiceRepository.getInvoiceById as jest.Mock).mockResolvedValue(mockInvoice);
      (mockInvoiceRepository.deleteInvoice as jest.Mock).mockResolvedValue(mockInvoice);

      const result = await invoiceService.deleteInvoice('invoice-123');

      expect(mockInvoiceRepository.getInvoiceById).toHaveBeenCalledWith('invoice-123');
      expect(mockInvoiceRepository.deleteInvoice).toHaveBeenCalledWith('invoice-123');
      expect(result).toEqual(mockInvoice);
    });

    it('should throw AppError when invoice not found for deletion', async () => {
      (mockInvoiceRepository.getInvoiceById as jest.Mock).mockResolvedValue(null);

      await invoiceService.deleteInvoice('non-existent-id');

      expect(mockInvoiceRepository.getInvoiceById).toHaveBeenCalledWith('non-existent-id');
      expect(mockInvoiceRepository.deleteInvoice).not.toHaveBeenCalled();
      expect(mockErrorHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invoice not found',
          statusCode: HttpStatus.NOT_FOUND,
        })
      );
    });

    it('should handle error during invoice deletion', async () => {
      (mockInvoiceRepository.getInvoiceById as jest.Mock).mockResolvedValue(mockInvoice);
      const error = new Error('Delete failed');
      (mockInvoiceRepository.deleteInvoice as jest.Mock).mockRejectedValue(error);

      await invoiceService.deleteInvoice('invoice-123');

      expect(mockErrorHandler).toHaveBeenCalledWith(error);
    });

    it('should handle error during existence check for deletion', async () => {
      const error = new Error('Database connection failed');
      (mockInvoiceRepository.getInvoiceById as jest.Mock).mockRejectedValue(error);

      await invoiceService.deleteInvoice('invoice-123');

      expect(mockErrorHandler).toHaveBeenCalledWith(error);
      expect(mockInvoiceRepository.deleteInvoice).not.toHaveBeenCalled();
    });
  });

  describe('getInvoiceCount', () => {
    it('should return invoice count successfully', async () => {
      (mockInvoiceRepository.countInvoices as jest.Mock).mockResolvedValue(5);

      const result = await invoiceService.getInvoiceCount();

      expect(mockInvoiceRepository.countInvoices).toHaveBeenCalled();
      expect(result).toBe(5);
    });

    it('should return zero when no invoices exist', async () => {
      (mockInvoiceRepository.countInvoices as jest.Mock).mockResolvedValue(0);

      const result = await invoiceService.getInvoiceCount();

      expect(result).toBe(0);
    });

    it('should handle error during count operation', async () => {
      const error = new Error('Count operation failed');
      (mockInvoiceRepository.countInvoices as jest.Mock).mockRejectedValue(error);

      await invoiceService.getInvoiceCount();

      expect(mockErrorHandler).toHaveBeenCalledWith(error);
    });
  });

  describe('getTotalAmount', () => {
    it('should return total amount successfully', async () => {
      (mockInvoiceRepository.getTotalAmount as jest.Mock).mockResolvedValue(15000.75);

      const result = await invoiceService.getTotalAmount();

      expect(mockInvoiceRepository.getTotalAmount).toHaveBeenCalled();
      expect(result).toBe(15000.75);
    });

    it('should return zero when no invoices exist', async () => {
      (mockInvoiceRepository.getTotalAmount as jest.Mock).mockResolvedValue(0);

      const result = await invoiceService.getTotalAmount();

      expect(result).toBe(0);
    });

    it('should handle error during total amount calculation', async () => {
      const error = new Error('Total amount calculation failed');
      (mockInvoiceRepository.getTotalAmount as jest.Mock).mockRejectedValue(error);

      await invoiceService.getTotalAmount();

      expect(mockErrorHandler).toHaveBeenCalledWith(error);
    });
  });

  describe('getTotalAmountUnpaid', () => {
    it('should return total unpaid amount successfully', async () => {
      (mockInvoiceRepository.getTotalAmountUnpaid as jest.Mock).mockResolvedValue(7500.25);

      const result = await invoiceService.getTotalAmountUnpaid();

      expect(mockInvoiceRepository.getTotalAmountUnpaid).toHaveBeenCalled();
      expect(result).toBe(7500.25);
    });

    it('should return zero when no unpaid invoices exist', async () => {
      (mockInvoiceRepository.getTotalAmountUnpaid as jest.Mock).mockResolvedValue(0);

      const result = await invoiceService.getTotalAmountUnpaid();

      expect(result).toBe(0);
    });

    it('should handle error during unpaid amount calculation', async () => {
      const error = new Error('Unpaid amount calculation failed');
      (mockInvoiceRepository.getTotalAmountUnpaid as jest.Mock).mockRejectedValue(error);

      await invoiceService.getTotalAmountUnpaid();

      expect(mockErrorHandler).toHaveBeenCalledWith(error);
    });
  });
});