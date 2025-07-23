import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  getInvoiceCount,
  getTotalAmount,
  getTotalAmountUnpaid,
} from '../../../modules/invoice/invoice.service';
import * as invoiceRepository from '../../../modules/invoice/invoice.repository';
import { AppError } from '../../../errors/AppError';
import { HttpStatus } from '../../../enums/http-status.enum';
import { mockCreateInvoiceDto } from '../../mocks/invoice.mock';

jest.mock('../../../modules/invoice/invoice.repository');
jest.mock('../../../handlers/errorHandler', () => ({
  errorHandler: jest.fn(),
}));

describe('Invoice Service', () => {
  describe('createInvoice', () => {
    it('should create an invoice successfully', async () => {
      const mockData = { id: '1', amount: 100 };
      (invoiceRepository.createInvoice as jest.Mock).mockResolvedValue(
        mockData,
      );

      const result = await createInvoice(mockCreateInvoiceDto);
      expect(result).toEqual(mockData);
      expect(invoiceRepository.createInvoice).toHaveBeenCalledWith(mockData);
    });

    it('should handle errors during invoice creation', async () => {
      const mockError = new Error('Database error');
      (invoiceRepository.createInvoice as jest.Mock).mockRejectedValue(
        mockError,
      );

      await expect(createInvoice(mockCreateInvoiceDto)).rejects.toThrow(
        mockError,
      );
    });
  });

  describe('getAllInvoices', () => {
    it('should retrieve all invoices', async () => {
      const mockInvoices = [{ id: '1', amount: 100 }];
      (invoiceRepository.getAllInvoices as jest.Mock).mockResolvedValue(
        mockInvoices,
      );

      const result = await getAllInvoices();
      expect(result).toEqual(mockInvoices);
      expect(invoiceRepository.getAllInvoices).toHaveBeenCalled();
    });
  });

  describe('getInvoiceById', () => {
    it('should retrieve an invoice by ID', async () => {
      const mockInvoice = { id: '1', amount: 100 };
      (invoiceRepository.getInvoiceById as jest.Mock).mockResolvedValue(
        mockInvoice,
      );

      const result = await getInvoiceById('1');
      expect(result).toEqual(mockInvoice);
      expect(invoiceRepository.getInvoiceById).toHaveBeenCalledWith('1');
    });

    it('should throw an error if invoice is not found', async () => {
      (invoiceRepository.getInvoiceById as jest.Mock).mockResolvedValue(null);

      await expect(getInvoiceById('1')).rejects.toThrow(AppError);
    });
  });

  describe('updateInvoice', () => {
    it('should update an invoice successfully', async () => {
      const mockInvoice = { id: '1', amount: 100, description: 'Test invoice' };
      const mockData = { amount: 200, description: 'Updated invoice' };
      (invoiceRepository.getInvoiceById as jest.Mock).mockResolvedValue(
        mockInvoice,
      );
      (invoiceRepository.updateInvoice as jest.Mock).mockResolvedValue({
        ...mockInvoice,
        ...mockData,
      });

      const result = await updateInvoice('1', mockData);
      expect(result).toEqual({ ...mockInvoice, ...mockData });
      expect(invoiceRepository.updateInvoice).toHaveBeenCalledWith(
        '1',
        mockData,
      );
    });

    it('should throw an error if invoice is not found', async () => {
      (invoiceRepository.getInvoiceById as jest.Mock).mockResolvedValue(null);

      await expect(
        updateInvoice('1', { amount: 200, description: 'Updated invoice' }),
      ).rejects.toThrow(AppError);
    });
  });

  describe('deleteInvoice', () => {
    it('should delete an invoice successfully', async () => {
      const mockInvoice = { id: '1', amount: 100 };
      (invoiceRepository.getInvoiceById as jest.Mock).mockResolvedValue(
        mockInvoice,
      );
      (invoiceRepository.deleteInvoice as jest.Mock).mockResolvedValue(true);

      const result = await deleteInvoice('1');
      expect(result).toBe(true);
      expect(invoiceRepository.deleteInvoice).toHaveBeenCalledWith('1');
    });

    it('should throw an error if invoice is not found', async () => {
      (invoiceRepository.getInvoiceById as jest.Mock).mockResolvedValue(null);

      await expect(deleteInvoice('1')).rejects.toThrow(AppError);
    });
  });

  describe('getInvoiceCount', () => {
    it('should return the count of invoices', async () => {
      (invoiceRepository.countInvoices as jest.Mock).mockResolvedValue(5);

      const result = await getInvoiceCount();
      expect(result).toBe(5);
      expect(invoiceRepository.countInvoices).toHaveBeenCalled();
    });
  });

  describe('getTotalAmount', () => {
    it('should return the total amount of invoices', async () => {
      (invoiceRepository.getTotalAmount as jest.Mock).mockResolvedValue(1000);

      const result = await getTotalAmount();
      expect(result).toBe(1000);
      expect(invoiceRepository.getTotalAmount).toHaveBeenCalled();
    });
  });

  describe('getTotalAmountUnpaid', () => {
    it('should return the total unpaid amount of invoices', async () => {
      (invoiceRepository.getTotalAmountUnpaid as jest.Mock).mockResolvedValue(
        500,
      );

      const result = await getTotalAmountUnpaid();
      expect(result).toBe(500);
      expect(invoiceRepository.getTotalAmountUnpaid).toHaveBeenCalled();
    });
  });
});
