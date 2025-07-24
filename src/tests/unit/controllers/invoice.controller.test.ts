import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../../enums/http-status.enum';
import * as invoiceService from '../../../modules/invoice/invoice.service';
import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  getInvoiceCount,
  getTotalAmount,
  getTotalAmountUnpaid,
} from '../../../modules/invoice/invoice.controller';
import {
  mockCreateInvoiceDto,
  mockUpdateInvoiceDto,
  mockInvoice,
  mockInvoices,
  mockUpdatedInvoice,
} from '../../mocks/invoice.mock';

jest.mock('../../../modules/invoice/invoice.service');
const mockInvoiceService = invoiceService as jest.Mocked<typeof invoiceService>;

describe('Invoice Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('createInvoice', () => {
    it('should create an invoice and return 201 status', async () => {
      mockRequest.body = mockCreateInvoiceDto;
      (mockInvoiceService.createInvoice as jest.Mock).mockResolvedValue(
        mockInvoice,
      );

      await createInvoice(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockInvoiceService.createInvoice).toHaveBeenCalledWith(
        mockCreateInvoiceDto,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith(mockInvoice);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error when service throws', async () => {
      const error = new Error('Service error');
      mockRequest.body = mockCreateInvoiceDto;
      (mockInvoiceService.createInvoice as jest.Mock).mockRejectedValue(error);

      await createInvoice(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should handle validation errors', async () => {
      const validationError = new Error('Validation failed');
      mockRequest.body = { ...mockCreateInvoiceDto, invoiceReference: '' };
      (mockInvoiceService.createInvoice as jest.Mock).mockRejectedValue(
        validationError,
      );

      await createInvoice(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(validationError);
    });
  });

  describe('getAllInvoices', () => {
    it('should return all invoices with 200 status', async () => {
      (mockInvoiceService.getAllInvoices as jest.Mock).mockResolvedValue(
        mockInvoices,
      );

      await getAllInvoices(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockInvoiceService.getAllInvoices).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(mockInvoices);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return empty array when no invoices exist', async () => {
      (mockInvoiceService.getAllInvoices as jest.Mock).mockResolvedValue([]);

      await getAllInvoices(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });

    it('should call next with error when service throws', async () => {
      const error = new Error('Database error');
      (mockInvoiceService.getAllInvoices as jest.Mock).mockRejectedValue(error);

      await getAllInvoices(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });

  describe('getInvoiceById', () => {
    it('should return invoice by id with 200 status', async () => {
      mockRequest.params = { id: 'invoice-123' };
      (mockInvoiceService.getInvoiceById as jest.Mock).mockResolvedValue(
        mockInvoice,
      );

      await getInvoiceById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockInvoiceService.getInvoiceById).toHaveBeenCalledWith(
        'invoice-123',
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(mockInvoice);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error when invoice not found', async () => {
      const notFoundError = new Error('Invoice not found');
      mockRequest.params = { id: 'non-existent-id' };
      (mockInvoiceService.getInvoiceById as jest.Mock).mockRejectedValue(
        notFoundError,
      );

      await getInvoiceById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(notFoundError);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should handle missing id parameter', async () => {
      mockRequest.params = {};
      (mockInvoiceService.getInvoiceById as jest.Mock).mockResolvedValue(
        mockInvoice,
      );

      await getInvoiceById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockInvoiceService.getInvoiceById).toHaveBeenCalledWith(undefined);
    });
  });

  describe('updateInvoice', () => {
    it('should update invoice and return 200 status', async () => {
      mockRequest.params = { id: 'invoice-123' };
      mockRequest.body = mockUpdateInvoiceDto;
      (mockInvoiceService.updateInvoice as jest.Mock).mockResolvedValue(
        mockUpdatedInvoice,
      );

      await updateInvoice(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockInvoiceService.updateInvoice).toHaveBeenCalledWith(
        'invoice-123',
        mockUpdateInvoiceDto,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedInvoice);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error when invoice not found for update', async () => {
      const notFoundError = new Error('Invoice not found');
      mockRequest.params = { id: 'non-existent-id' };
      mockRequest.body = mockUpdateInvoiceDto;
      (mockInvoiceService.updateInvoice as jest.Mock).mockRejectedValue(
        notFoundError,
      );

      await updateInvoice(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(notFoundError);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should handle partial update data', async () => {
      const partialUpdate = { description: 'Updated description' };
      mockRequest.params = { id: 'invoice-123' };
      mockRequest.body = partialUpdate;
      (mockInvoiceService.updateInvoice as jest.Mock).mockResolvedValue(
        mockUpdatedInvoice,
      );

      await updateInvoice(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockInvoiceService.updateInvoice).toHaveBeenCalledWith(
        'invoice-123',
        partialUpdate,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should call next with error when update fails', async () => {
      const updateError = new Error('Update failed');
      mockRequest.params = { id: 'invoice-123' };
      mockRequest.body = mockUpdateInvoiceDto;
      (mockInvoiceService.updateInvoice as jest.Mock).mockRejectedValue(
        updateError,
      );

      await updateInvoice(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(updateError);
    });
  });

  describe('deleteInvoice', () => {
    it('should delete invoice and return 204 status', async () => {
      mockRequest.params = { id: 'invoice-123' };
      (mockInvoiceService.deleteInvoice as jest.Mock).mockResolvedValue(
        mockInvoice,
      );

      await deleteInvoice(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockInvoiceService.deleteInvoice).toHaveBeenCalledWith(
        'invoice-123',
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
      expect(mockResponse.send).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error when invoice not found for deletion', async () => {
      const notFoundError = new Error('Invoice not found');
      mockRequest.params = { id: 'non-existent-id' };
      (mockInvoiceService.deleteInvoice as jest.Mock).mockRejectedValue(
        notFoundError,
      );

      await deleteInvoice(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(notFoundError);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should call next with error when deletion fails', async () => {
      const deleteError = new Error('Delete operation failed');
      mockRequest.params = { id: 'invoice-123' };
      (mockInvoiceService.deleteInvoice as jest.Mock).mockRejectedValue(
        deleteError,
      );

      await deleteInvoice(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(deleteError);
    });
  });

  describe('getInvoiceCount', () => {
    it('should return invoice count with 200 status', async () => {
      (mockInvoiceService.getInvoiceCount as jest.Mock).mockResolvedValue(5);

      await getInvoiceCount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockInvoiceService.getInvoiceCount).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({ count: 5 });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return zero count when no invoices exist', async () => {
      (mockInvoiceService.getInvoiceCount as jest.Mock).mockResolvedValue(0);

      await getInvoiceCount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.json).toHaveBeenCalledWith({ count: 0 });
    });

    it('should call next with error when count operation fails', async () => {
      const countError = new Error('Count operation failed');
      (mockInvoiceService.getInvoiceCount as jest.Mock).mockRejectedValue(
        countError,
      );

      await getInvoiceCount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(countError);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });

  describe('getTotalAmount', () => {
    it('should return total amount with 200 status', async () => {
      (mockInvoiceService.getTotalAmount as jest.Mock).mockResolvedValue(
        5000.25,
      );

      await getTotalAmount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockInvoiceService.getTotalAmount).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({ totalAmount: 5000.25 });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return zero total when no invoices exist', async () => {
      (mockInvoiceService.getTotalAmount as jest.Mock).mockResolvedValue(0);

      await getTotalAmount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.json).toHaveBeenCalledWith({ totalAmount: 0 });
    });

    it('should call next with error when total calculation fails', async () => {
      const totalError = new Error('Total calculation failed');
      (mockInvoiceService.getTotalAmount as jest.Mock).mockRejectedValue(
        totalError,
      );

      await getTotalAmount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(totalError);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });

  describe('getTotalAmountUnpaid', () => {
    it('should return total unpaid amount with 200 status', async () => {
      (mockInvoiceService.getTotalAmountUnpaid as jest.Mock).mockResolvedValue(
        2250.5,
      );

      await getTotalAmountUnpaid(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockInvoiceService.getTotalAmountUnpaid).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        totalAmountUnpaid: 2250.5,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return zero unpaid amount when no unpaid invoices exist', async () => {
      (mockInvoiceService.getTotalAmountUnpaid as jest.Mock).mockResolvedValue(
        0,
      );

      await getTotalAmountUnpaid(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.json).toHaveBeenCalledWith({ totalAmountUnpaid: 0 });
    });

    it('should call next with error when unpaid calculation fails', async () => {
      const unpaidError = new Error('Unpaid calculation failed');
      (mockInvoiceService.getTotalAmountUnpaid as jest.Mock).mockRejectedValue(
        unpaidError,
      );

      await getTotalAmountUnpaid(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(unpaidError);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle unexpected errors in createInvoice', async () => {
      const unexpectedError = new TypeError('Unexpected error');
      mockRequest.body = mockCreateInvoiceDto;
      (mockInvoiceService.createInvoice as jest.Mock).mockRejectedValue(
        unexpectedError,
      );

      await createInvoice(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(unexpectedError);
    });

    it('should handle network errors in getAllInvoices', async () => {
      const networkError = new Error('Network timeout');
      (mockInvoiceService.getAllInvoices as jest.Mock).mockRejectedValue(
        networkError,
      );

      await getAllInvoices(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(networkError);
    });

    it('should handle malformed request data', async () => {
      mockRequest.body = null;
      const validationError = new Error('Invalid request body');
      (mockInvoiceService.createInvoice as jest.Mock).mockRejectedValue(
        validationError,
      );

      await createInvoice(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(validationError);
    });
  });
});
