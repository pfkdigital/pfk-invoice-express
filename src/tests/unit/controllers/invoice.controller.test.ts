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
  mockUpdatedInvoice
} from '../../mocks/invoice.mock';

jest.mock('./invoice.service');
const mockInvoiceService = invoiceService as jest.Mocked<typeof invoiceService>;

describe('Invoice Controller', () => {
  const mockRequest = (body = {}, params = {}) =>
    ({
      body,
      params,
    }) as unknown as Request;

  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createInvoice', () => {
    it('should create an invoice and return it', async () => {
      const req = mockRequest(mockCreateInvoiceDto);
      const res = mockResponse();
      mockInvoiceService.createInvoice.mockResolvedValue(mockInvoice);

      await createInvoice(req, res, mockNext);

      expect(mockInvoiceService.createInvoice).toHaveBeenCalledWith(mockCreateInvoiceDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith(mockInvoice);
    });

    it('should call next with error if service fails', async () => {
      const req = mockRequest(mockCreateInvoiceDto);
      const res = mockResponse();
      const error = new Error('Service Error');
      mockInvoiceService.createInvoice.mockRejectedValue(error);

      await createInvoice(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllInvoices', () => {
    it('should return all invoices', async () => {
      const req = mockRequest();
      const res = mockResponse();
      mockInvoiceService.getAllInvoices.mockResolvedValue(mockInvoices);

      await getAllInvoices(req, res, mockNext);

      expect(mockInvoiceService.getAllInvoices).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(mockInvoices);
    });

    it('should call next with error if service fails', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const error = new Error('Service Error');
      mockInvoiceService.getAllInvoices.mockRejectedValue(error);

      await getAllInvoices(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getInvoiceById', () => {
    it('should return an invoice by ID', async () => {
      const req = mockRequest({}, { id: 'invoice-123' });
      const res = mockResponse();
      mockInvoiceService.getInvoiceById.mockResolvedValue(mockInvoice);

      await getInvoiceById(req, res, mockNext);

      expect(mockInvoiceService.getInvoiceById).toHaveBeenCalledWith('invoice-123');
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(mockInvoice);
    });

    it('should call next with error if service fails', async () => {
      const req = mockRequest({}, { id: 'invoice-123' });
      const res = mockResponse();
      const error = new Error('Service Error');
      mockInvoiceService.getInvoiceById.mockRejectedValue(error);

      await getInvoiceById(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateInvoice', () => {
    it('should update an invoice and return it', async () => {
      const req = mockRequest(mockUpdateInvoiceDto, { id: 'invoice-123' });
      const res = mockResponse();
      mockInvoiceService.updateInvoice.mockResolvedValue(mockUpdatedInvoice);

      await updateInvoice(req, res, mockNext);

      expect(mockInvoiceService.updateInvoice).toHaveBeenCalledWith('invoice-123', mockUpdateInvoiceDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedInvoice);
    });

    it('should call next with error if service fails', async () => {
      const req = mockRequest(mockUpdateInvoiceDto, { id: 'invoice-123' });
      const res = mockResponse();
      const error = new Error('Service Error');
      mockInvoiceService.updateInvoice.mockRejectedValue(error);

      await updateInvoice(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteInvoice', () => {
    it('should delete an invoice and return no content', async () => {
      const req = mockRequest({}, { id: 'invoice-123' });
      const res = mockResponse();
      mockInvoiceService.deleteInvoice.mockResolvedValue();

      await deleteInvoice(req, res, mockNext);

      expect(mockInvoiceService.deleteInvoice).toHaveBeenCalledWith('invoice-123');
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
      expect(res.send).toHaveBeenCalled();
    });

    it('should call next with error if service fails', async () => {
      const req = mockRequest({}, { id: 'invoice-123' });
      const res = mockResponse();
      const error = new Error('Service Error');
      mockInvoiceService.deleteInvoice.mockRejectedValue(error);

      await deleteInvoice(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getInvoiceCount', () => {
    it('should return the count of invoices', async () => {
      const req = mockRequest();
      const res = mockResponse();
      mockInvoiceService.getInvoiceCount.mockResolvedValue(5);

      await getInvoiceCount(req, res, mockNext);

      expect(mockInvoiceService.getInvoiceCount).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({ count: 5 });
    });

    it('should call next with error if service fails', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const error = new Error('Service Error');
      mockInvoiceService.getInvoiceCount.mockRejectedValue(error);

      await getInvoiceCount(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getTotalAmount', () => {
    it('should return the total amount of invoices', async () => {
      const req = mockRequest();
      const res = mockResponse();
      mockInvoiceService.getTotalAmount.mockResolvedValue(5000.25);

      await getTotalAmount(req, res, mockNext);

      expect(mockInvoiceService.getTotalAmount).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({ totalAmount: 5000.25 });
    });

    it('should call next with error if service fails', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const error = new Error('Service Error');
      mockInvoiceService.getTotalAmount.mockRejectedValue(error);

      await getTotalAmount(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getTotalAmountUnpaid', () => {
    it('should return the total unpaid amount of invoices', async () => {
      const req = mockRequest();
      const res = mockResponse();
      mockInvoiceService.getTotalAmountUnpaid.mockResolvedValue(2250.5);

      await getTotalAmountUnpaid(req, res, mockNext);

      expect(mockInvoiceService.getTotalAmountUnpaid).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({ totalAmountUnpaid: 2250.5 });
    });

    it('should call next with error if service fails', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const error = new Error('Service Error');
      mockInvoiceService.getTotalAmountUnpaid.mockRejectedValue(error);

      await getTotalAmountUnpaid(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });