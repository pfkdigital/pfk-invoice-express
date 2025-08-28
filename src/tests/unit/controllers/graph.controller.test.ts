import { Request, Response, NextFunction } from 'express';
import * as graphController from '../../../modules/graph/graph.controller';
import * as graphService from '../../../modules/graph/graph.service';
import { HttpStatus } from '../../../enums/http-status.enum';

jest.mock('../../../modules/graph/graph.service');

describe('Graph Controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {
            query: {},
            params: {}
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockNext = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getMonthlyRevenue', () => {
        it('should return monthly revenue data', async () => {
            const mockData = [{ month: 'January', revenue: 1000 }];
            (graphService.getMonthlyRevenue as jest.Mock).mockResolvedValue(mockData);

            await graphController.getMonthlyRevenue(mockRequest as Request, mockResponse as Response, mockNext);

            expect(graphService.getMonthlyRevenue).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(mockResponse.json).toHaveBeenCalledWith(mockData);
        });

        it('should call next with error when service throws', async () => {
            const error = new Error('Service error');
            (graphService.getMonthlyRevenue as jest.Mock).mockRejectedValue(error);

            await graphController.getMonthlyRevenue(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getInvoiceStatusDistribution', () => {
        it('should return invoice status distribution', async () => {
            const mockData = { paid: 10, pending: 5, overdue: 2 };
            (graphService.getInvoiceStatusDistribution as jest.Mock).mockResolvedValue(mockData);

            await graphController.getInvoiceStatusDistribution(mockRequest as Request, mockResponse as Response, mockNext);

            expect(graphService.getInvoiceStatusDistribution).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(mockResponse.json).toHaveBeenCalledWith(mockData);
        });

        it('should call next with error when service throws', async () => {
            const error = new Error('Service error');
            (graphService.getInvoiceStatusDistribution as jest.Mock).mockRejectedValue(error);

            await graphController.getInvoiceStatusDistribution(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getTopClientsByRevenue', () => {
        it('should return top clients with default limit', async () => {
            const mockData = [{ clientId: '1', revenue: 5000 }];
            (graphService.getTopClientsByRevenue as jest.Mock).mockResolvedValue(mockData);

            await graphController.getTopClientsByRevenue(mockRequest as Request, mockResponse as Response, mockNext);

            expect(graphService.getTopClientsByRevenue).toHaveBeenCalledWith(10);
            expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(mockResponse.json).toHaveBeenCalledWith(mockData);
        });

        it('should return top clients with custom limit', async () => {
            mockRequest.query = { limit: '5' };
            const mockData = [{ clientId: '1', revenue: 5000 }];
            (graphService.getTopClientsByRevenue as jest.Mock).mockResolvedValue(mockData);

            await graphController.getTopClientsByRevenue(mockRequest as Request, mockResponse as Response, mockNext);

            expect(graphService.getTopClientsByRevenue).toHaveBeenCalledWith(5);
            expect(mockResponse.json).toHaveBeenCalledWith(mockData);
        });

        it('should call next with error when service throws', async () => {
            const error = new Error('Service error');
            (graphService.getTopClientsByRevenue as jest.Mock).mockRejectedValue(error);

            await graphController.getTopClientsByRevenue(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getInvoiceAgingAnalysis', () => {
        it('should return invoice aging analysis', async () => {
            const mockData = { current: 10, overdue30: 5, overdue60: 2 };
            (graphService.getInvoiceAgingAnalysis as jest.Mock).mockResolvedValue(mockData);

            await graphController.getInvoiceAgingAnalysis(mockRequest as Request, mockResponse as Response, mockNext);

            expect(graphService.getInvoiceAgingAnalysis).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(mockResponse.json).toHaveBeenCalledWith(mockData);
        });

        it('should call next with error when service throws', async () => {
            const error = new Error('Service error');
            (graphService.getInvoiceAgingAnalysis as jest.Mock).mockRejectedValue(error);

            await graphController.getInvoiceAgingAnalysis(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getCashFlowProjection', () => {
        it('should return cash flow projection with default months', async () => {
            const mockData = [{ month: 'January', cashFlow: 1000 }];
            (graphService.getCashFlowProjection as jest.Mock).mockResolvedValue(mockData);

            await graphController.getCashFlowProjection(mockRequest as Request, mockResponse as Response, mockNext);

            expect(graphService.getCashFlowProjection).toHaveBeenCalledWith(12);
            expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(mockResponse.json).toHaveBeenCalledWith(mockData);
        });

        it('should return cash flow projection with custom months', async () => {
            mockRequest.query = { months: '6' };
            const mockData = [{ month: 'January', cashFlow: 1000 }];
            (graphService.getCashFlowProjection as jest.Mock).mockResolvedValue(mockData);

            await graphController.getCashFlowProjection(mockRequest as Request, mockResponse as Response, mockNext);

            expect(graphService.getCashFlowProjection).toHaveBeenCalledWith(6);
            expect(mockResponse.json).toHaveBeenCalledWith(mockData);
        });

        it('should call next with error when service throws', async () => {
            const error = new Error('Service error');
            (graphService.getCashFlowProjection as jest.Mock).mockRejectedValue(error);

            await graphController.getCashFlowProjection(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getDashboardData', () => {
        it('should return consolidated dashboard data', async () => {
            const mockData = {
                monthlyRevenue: [],
                statusDistribution: {},
                topClients: [],
                agingAnalysis: {},
                cashFlow: []
            };
            
            (graphService.getMonthlyRevenue as jest.Mock).mockResolvedValue(mockData.monthlyRevenue);
            (graphService.getInvoiceStatusDistribution as jest.Mock).mockResolvedValue(mockData.statusDistribution);
            (graphService.getTopClientsByRevenue as jest.Mock).mockResolvedValue(mockData.topClients);
            (graphService.getInvoiceAgingAnalysis as jest.Mock).mockResolvedValue(mockData.agingAnalysis);
            (graphService.getCashFlowProjection as jest.Mock).mockResolvedValue(mockData.cashFlow);

            await graphController.getDashboardData(mockRequest as Request, mockResponse as Response, mockNext);

            expect(graphService.getMonthlyRevenue).toHaveBeenCalled();
            expect(graphService.getInvoiceStatusDistribution).toHaveBeenCalled();
            expect(graphService.getTopClientsByRevenue).toHaveBeenCalledWith(5);
            expect(graphService.getInvoiceAgingAnalysis).toHaveBeenCalled();
            expect(graphService.getCashFlowProjection).toHaveBeenCalledWith(12);
            expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                ...mockData,
                lastUpdated: expect.any(String)
            }));
        });

        it('should call next with error when service throws', async () => {
            const error = new Error('Service error');
            (graphService.getMonthlyRevenue as jest.Mock).mockRejectedValue(error);

            await graphController.getDashboardData(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getRevenueByClient', () => {
        it('should return client revenue with default months', async () => {
            mockRequest.params = { clientId: '123' };
            const mockData = [{ month: 'January', revenue: 1000 }];
            (graphService.getRevenueByClient as jest.Mock).mockResolvedValue(mockData);

            await graphController.getRevenueByClient(mockRequest as Request, mockResponse as Response, mockNext);

            expect(graphService.getRevenueByClient).toHaveBeenCalledWith('123', 12);
            expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(mockResponse.json).toHaveBeenCalledWith(mockData);
        });

        it('should return client revenue with custom months', async () => {
            mockRequest.params = { clientId: '123' };
            mockRequest.query = { months: '6' };
            const mockData = [{ month: 'January', revenue: 1000 }];
            (graphService.getRevenueByClient as jest.Mock).mockResolvedValue(mockData);

            await graphController.getRevenueByClient(mockRequest as Request, mockResponse as Response, mockNext);

            expect(graphService.getRevenueByClient).toHaveBeenCalledWith('123', 6);
            expect(mockResponse.json).toHaveBeenCalledWith(mockData);
        });

        it('should call next with error when service throws', async () => {
            mockRequest.params = { clientId: '123' };
            const error = new Error('Service error');
            (graphService.getRevenueByClient as jest.Mock).mockRejectedValue(error);

            await graphController.getRevenueByClient(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getPaymentTrends', () => {
        it('should return payment trends', async () => {
            const mockData = [{ period: 'Q1', trend: 'up' }];
            (graphService.getPaymentTrends as jest.Mock).mockResolvedValue(mockData);

            await graphController.getPaymentTrends(mockRequest as Request, mockResponse as Response, mockNext);

            expect(graphService.getPaymentTrends).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(mockResponse.json).toHaveBeenCalledWith(mockData);
        });

        it('should call next with error when service throws', async () => {
            const error = new Error('Service error');
            (graphService.getPaymentTrends as jest.Mock).mockRejectedValue(error);

            await graphController.getPaymentTrends(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });
});