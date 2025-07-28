import { Request, Response, NextFunction } from 'express';
import * as analyticsController from '../../../modules/analytics/analytics.controller';
import * as analyticsService from '../../../modules/analytics/analytics.service';

jest.mock('../../../modules/analytics/analytics.service');

describe('Analytics Controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockNext = jest.fn();
        jest.clearAllMocks();
    });

    describe('getInvoiceCount', () => {
        it('should return invoice count on success', async () => {
            const mockCount = 10;
            (analyticsService.getInvoiceCount as jest.Mock).mockResolvedValue(mockCount);

            await analyticsController.getInvoiceCount(mockRequest as Request, mockResponse as Response, mockNext);

            expect(analyticsService.getInvoiceCount).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ count: mockCount });
        });

        it('should call next with error on failure', async () => {
            const mockError = new Error('Database error');
            (analyticsService.getInvoiceCount as jest.Mock).mockRejectedValue(mockError);

            await analyticsController.getInvoiceCount(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe('getClientCount', () => {
        it('should return client count on success', async () => {
            const mockCount = 5;
            (analyticsService.getClientCount as jest.Mock).mockResolvedValue(mockCount);

            await analyticsController.getClientCount(mockRequest as Request, mockResponse as Response, mockNext);

            expect(analyticsService.getClientCount).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ count: mockCount });
        });

        it('should call next with error on failure', async () => {
            const mockError = new Error('Database error');
            (analyticsService.getClientCount as jest.Mock).mockRejectedValue(mockError);

            await analyticsController.getClientCount(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe('getTotalAmount', () => {
        it('should return total amount on success', async () => {
            const mockTotal = 1000.50;
            (analyticsService.getTotalAmount as jest.Mock).mockResolvedValue(mockTotal);

            await analyticsController.getTotalAmount(mockRequest as Request, mockResponse as Response, mockNext);

            expect(analyticsService.getTotalAmount).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ total: mockTotal });
        });

        it('should call next with error on failure', async () => {
            const mockError = new Error('Database error');
            (analyticsService.getTotalAmount as jest.Mock).mockRejectedValue(mockError);

            await analyticsController.getTotalAmount(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe('getTotalAmountUnpaid', () => {
        it('should return total unpaid amount on success', async () => {
            const mockTotalUnpaid = 250.75;
            (analyticsService.getTotalAmountUnpaid as jest.Mock).mockResolvedValue(mockTotalUnpaid);

            await analyticsController.getTotalAmountUnpaid(mockRequest as Request, mockResponse as Response, mockNext);

            expect(analyticsService.getTotalAmountUnpaid).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ totalUnpaid: mockTotalUnpaid });
        });

        it('should call next with error on failure', async () => {
            const mockError = new Error('Database error');
            (analyticsService.getTotalAmountUnpaid as jest.Mock).mockRejectedValue(mockError);

            await analyticsController.getTotalAmountUnpaid(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });
});