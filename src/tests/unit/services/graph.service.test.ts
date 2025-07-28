import prisma from '../../../config/prisma';
import { errorHandler } from '../../../handlers/errorHandler';
import {
  getInvoiceAgingAnalysis,
  getCashFlowProjection,
  getRevenueByClient,
  getPaymentTrends,
  getInvoiceStatusDistribution,
  getMonthlyRevenue,
  getTopClientsByRevenue,
} from '../../../modules/graph/graph.service';

jest.mock('../../../config/prisma', () => ({
  $queryRaw: jest.fn(),
  invoice: {
    findMany: jest.fn(),
  },
}));
jest.mock('../../../handlers/errorHandler', () => ({
  errorHandler: jest.fn(),
}));

describe('Graph Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMonthlyRevenue', () => {
    it('should return monthly revenue when query succeeds', async () => {
      const mockResult = [
        { month: 'January', revenue: 1000, year: 2024 },
        { month: 'February', revenue: 2000, year: 2024 },
      ];
      (prisma.$queryRaw as jest.Mock).mockResolvedValue(mockResult);

      const result = await getMonthlyRevenue();

      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });

    it('should call errorHandler and throw error when query fails', async () => {
      const mockError = new Error('DB error');
      (prisma.$queryRaw as jest.Mock).mockRejectedValue(mockError);

      await expect(getMonthlyRevenue()).rejects.toThrow(mockError);
      expect(errorHandler).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getInvoiceStatusDistribution', () => {
    it('should return status distribution when query succeeds', async () => {
      const mockResult = [
        { status: 'PAID', count: 10, total_amount: 5000 },
        { status: 'PENDING', count: 5, total_amount: 2500 },
      ];
      (prisma.$queryRaw as jest.Mock).mockResolvedValue(mockResult);

      const result = await getInvoiceStatusDistribution();

      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });

    it('should call errorHandler and throw error when query fails', async () => {
      const mockError = new Error('DB error');
      (prisma.$queryRaw as jest.Mock).mockRejectedValue(mockError);

      await expect(getInvoiceStatusDistribution()).rejects.toThrow(mockError);
      expect(errorHandler).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getTopClientsByRevenue', () => {
    it('should return top clients with default limit', async () => {
      const mockResult = [
        {
          client_id: '1',
          client_name: 'Client A',
          total_revenue: 10000,
          invoice_count: 5,
          average_invoice_value: 2000,
        },
      ];
      (prisma.$queryRaw as jest.Mock).mockResolvedValue(mockResult);

      const result = await getTopClientsByRevenue();

      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });

    it('should return top clients with custom limit', async () => {
      const mockResult = [
        {
          client_id: '1',
          client_name: 'Client A',
          total_revenue: 10000,
          invoice_count: 5,
          average_invoice_value: 2000,
        },
      ];
      (prisma.$queryRaw as jest.Mock).mockResolvedValue(mockResult);

      const result = await getTopClientsByRevenue(5);

      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });

    it('should call errorHandler and throw error when query fails', async () => {
      const mockError = new Error('DB error');
      (prisma.$queryRaw as jest.Mock).mockRejectedValue(mockError);

      await expect(getTopClientsByRevenue()).rejects.toThrow(mockError);
      expect(errorHandler).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getInvoiceAgingAnalysis', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return aging analysis with current invoices', async () => {
      const mockInvoices = [
        { id: '1', dueDate: new Date('2024-01-20'), totalAmount: 1000 }, // Current
        { id: '2', dueDate: new Date('2023-12-15'), totalAmount: 2000 }, // 31 days overdue
      ];
      (prisma.invoice.findMany as jest.Mock).mockResolvedValue(mockInvoices);

      const result = await getInvoiceAgingAnalysis();

      expect(prisma.invoice.findMany).toHaveBeenCalledWith({
        where: {
          status: {
            in: ['PENDING', 'OVERDUE'],
          },
        },
        select: {
          id: true,
          dueDate: true,
          totalAmount: true,
        },
      });
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({
        age_range: 'Current',
        count: 1,
        total_amount: 1000,
      });
    });

    it('should return empty array when no invoices found', async () => {
      (prisma.invoice.findMany as jest.Mock).mockResolvedValue([]);

      const result = await getInvoiceAgingAnalysis();

      expect(result).toEqual([]);
    });

    it('should call errorHandler and throw error when query fails', async () => {
      const mockError = new Error('DB error');
      (prisma.invoice.findMany as jest.Mock).mockRejectedValue(mockError);

      await expect(getInvoiceAgingAnalysis()).rejects.toThrow(mockError);
      expect(errorHandler).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getCashFlowProjection', () => {
    it('should return cash flow with default months', async () => {
      const mockResult = [
        {
          month: 'January',
          year: 2024,
          expected_inflow: 5000,
          actual_inflow: 3000,
        },
      ];
      (prisma.$queryRaw as jest.Mock).mockResolvedValue(mockResult);

      const result = await getCashFlowProjection();

      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });

    it('should return cash flow with custom months', async () => {
      const mockResult = [
        {
          month: 'January',
          year: 2024,
          expected_inflow: 5000,
          actual_inflow: 3000,
        },
      ];
      (prisma.$queryRaw as jest.Mock).mockResolvedValue(mockResult);

      const result = await getCashFlowProjection(6);

      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });

    it('should call errorHandler and throw error when query fails', async () => {
      const mockError = new Error('DB error');
      (prisma.$queryRaw as jest.Mock).mockRejectedValue(mockError);

      await expect(getCashFlowProjection()).rejects.toThrow(mockError);
      expect(errorHandler).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getRevenueByClient', () => {
    it('should return client revenue with default months', async () => {
      const mockResult = [
        { month: 'January', year: 2024, revenue: 2000, invoice_count: 2 },
      ];
      (prisma.$queryRaw as jest.Mock).mockResolvedValue(mockResult);

      const result = await getRevenueByClient('client-123');

      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });

    it('should return client revenue with custom months', async () => {
      const mockResult = [
        { month: 'January', year: 2024, revenue: 2000, invoice_count: 2 },
      ];
      (prisma.$queryRaw as jest.Mock).mockResolvedValue(mockResult);

      const result = await getRevenueByClient('client-123', 6);

      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });

    it('should call errorHandler and throw error when query fails', async () => {
      const mockError = new Error('DB error');
      (prisma.$queryRaw as jest.Mock).mockRejectedValue(mockError);

      await expect(getRevenueByClient('client-123')).rejects.toThrow(mockError);
      expect(errorHandler).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getPaymentTrends', () => {
    it('should return payment trends when query succeeds', async () => {
      const mockResult = [
        {
          month: 'January',
          year: 2024,
          avg_payment_days: 15.5,
          on_time_payments: 8,
          late_payments: 2,
          payment_efficiency: 80.0,
        },
      ];
      (prisma.$queryRaw as jest.Mock).mockResolvedValue(mockResult);

      const result = await getPaymentTrends();

      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });

    it('should call errorHandler and throw error when query fails', async () => {
      const mockError = new Error('DB error');
      (prisma.$queryRaw as jest.Mock).mockRejectedValue(mockError);

      await expect(getPaymentTrends()).rejects.toThrow(mockError);
      expect(errorHandler).toHaveBeenCalledWith(mockError);
    });
  });
});
