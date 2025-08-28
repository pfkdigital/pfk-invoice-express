import prisma from '../../config/prisma';
import * as clientService from '../client/client.service';
import { errorHandler } from '../../handlers/errorHandler';
import { AppError } from '../../errors/AppError';
import { HttpStatus } from '../../enums/http-status.enum';

export const getMonthlyRevenue = async () => {
  try {
    const monthlyRevenue = await prisma.$queryRaw<
      {
        month_year: string;
        revenue: number;
      }[]
    >`
        SELECT
          TO_CHAR("invoiceDate", 'YYYY-MM') AS date,
          SUM("totalAmount") AS revenue
        FROM "Invoice"
        WHERE "status" = 'PAID'
        GROUP BY TO_CHAR("invoiceDate", 'YYYY-MM')
        ORDER BY TO_CHAR("invoiceDate", 'YYYY-MM');
      `;

    return monthlyRevenue;
  } catch (error) {
    errorHandler(error);
    throw error;
  }
};

export const getMonthlyRevenueByClientId = async (clientId: string) => {
  try {
    const client = await clientService.getClientById(clientId);
    if (!client) {
      throw new AppError('Client not found', HttpStatus.NOT_FOUND);
    }
    const monthlyRevenue = await prisma.$queryRaw<
      {
        month_year: string;
        revenue: number;
      }[]
    >`
        SELECT
          TO_CHAR("invoiceDate", 'YYYY-MM') AS date,
          SUM("totalAmount") AS revenue
        FROM "Invoice"
        WHERE "status" = 'PAID' AND "clientId" = ${clientId}
        GROUP BY TO_CHAR("invoiceDate", 'YYYY-MM')
        ORDER BY TO_CHAR("invoiceDate", 'YYYY-MM');
      `;

    return monthlyRevenue;
  } catch (error) {
    errorHandler(error);
    throw error;
  }
}

export const getInvoiceStatusDistribution = async () => {
  try {
    const statusDistribution = await prisma.$queryRaw<
      {
        status: string;
        count: number;
        total_amount: number;
      }[]
    >`
            SELECT
                "status",
                COUNT(*)::integer AS count,
                SUM("totalAmount") AS total_amount
            FROM "Invoice"
            GROUP BY "status"
            ORDER BY count DESC;
        `;

    return statusDistribution;
  } catch (error) {
    errorHandler(error);
    throw error;
  }
};

export const getInvoiceStatusDistributionByClientId = async (clientId: string) => {
  try {
    const client = await clientService.getClientById(clientId);
    if (!client) {
      throw new AppError('Client not found', HttpStatus.NOT_FOUND);
    }

    const statusDistribution = await prisma.$queryRaw<
      {
        status: string;
        count: number;
        total_amount: number;
      }[]
    >`
            SELECT
                "status",
                COUNT(*)::integer AS count,
                SUM("totalAmount") AS total_amount
            FROM "Invoice"
            WHERE "clientId" = ${clientId}
            GROUP BY "status"
            ORDER BY count DESC;
        `;

    return statusDistribution;
  } catch (error) {
    errorHandler(error);
    throw error;
  }
}

export const getTopClientsByRevenue = async (limit: number = 10) => {
  try {
    const topClients = await prisma.$queryRaw<
      {
        client_id: string;
        client_name: string;
        total_revenue: number;
        invoice_count: number;
        average_invoice_value: number;
      }[]
    >`
            SELECT
                c.id AS client_id,
                c."clientName" AS client_name,
                SUM(i."totalAmount") AS total_revenue,
                COUNT(i.id)::integer AS invoice_count,
                AVG(i."totalAmount") AS average_invoice_value
            FROM "Client" c
            INNER JOIN "Invoice" i ON c.id = i."clientId"
            WHERE i."status" = 'PAID'
            GROUP BY c.id, c."clientName"
            ORDER BY total_revenue DESC
            LIMIT ${limit};
        `;

    return topClients;
  } catch (error) {
    errorHandler(error);
    throw error;
  }
};

export const getInvoiceAgingAnalysis = async () => {
  try {
    const invoices = await prisma.invoice.findMany({
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

    const currentDate = new Date();
    const agingBuckets = {
      Current: { count: 0, total_amount: 0 },
      '1-30 days overdue': { count: 0, total_amount: 0 },
      '31-60 days overdue': { count: 0, total_amount: 0 },
      '61-90 days overdue': { count: 0, total_amount: 0 },
      '90+ days overdue': { count: 0, total_amount: 0 },
    };

    invoices.forEach((invoice) => {
      const daysOverdue = Math.floor(
        (currentDate.getTime() - new Date(invoice.dueDate).getTime()) /
        (1000 * 60 * 60 * 24),
      );

      let bucket: keyof typeof agingBuckets;
      if (daysOverdue <= 0) {
        bucket = 'Current';
      } else if (daysOverdue <= 30) {
        bucket = '1-30 days overdue';
      } else if (daysOverdue <= 60) {
        bucket = '31-60 days overdue';
      } else if (daysOverdue <= 90) {
        bucket = '61-90 days overdue';
      } else {
        bucket = '90+ days overdue';
      }

      agingBuckets[bucket].count++;
      agingBuckets[bucket].total_amount += invoice.totalAmount;
    });

    const result = Object.entries(agingBuckets)
      .map(([age_range, data]) => ({
        age_range,
        count: data.count,
        total_amount: data.total_amount,
      }))
      .filter((item) => item.count > 0);

    return result;
  } catch (error) {
    errorHandler(error);
    throw error;
  }
};

export const getCashFlowProjection = async (months: number = 12) => {
  try {
    const cashFlow = await prisma.$queryRaw<
      {
        month: string;
        year: number;
        expected_inflow: number;
        actual_inflow: number;
      }[]
    >`
      SELECT
        TO_CHAR("dueDate", 'Month') AS month,
        EXTRACT(YEAR FROM "dueDate") AS year,
        ROUND(SUM(CASE WHEN "status" IN ('PENDING', 'OVERDUE') THEN "totalAmount" ELSE 0 END)::numeric, 2) AS expected_inflow,
        ROUND(SUM(CASE WHEN "status" = 'PAID' THEN "totalAmount" ELSE 0 END)::numeric, 2) AS actual_inflow
      FROM "Invoice"
      WHERE "dueDate" >= CURRENT_DATE - INTERVAL '${months} months'
      GROUP BY EXTRACT(YEAR FROM "dueDate"), EXTRACT(MONTH FROM "dueDate"), TO_CHAR("dueDate", 'Month')
      ORDER BY EXTRACT(YEAR FROM "dueDate"), EXTRACT(MONTH FROM "dueDate");
    `;

    return cashFlow;
  } catch (error) {
    errorHandler(error);
    throw error;
  }
};

export const getRevenueByClient = async (
  clientId: string,
  months: number = 12,
) => {
  try {
    const clientRevenue = await prisma.$queryRaw<
      {
        month: string;
        year: number;
        revenue: number;
        invoice_count: number;
      }[]
    >`
            SELECT
                TO_CHAR("invoiceDate", 'Month') AS month,
                EXTRACT(YEAR FROM "invoiceDate") AS year,
                SUM("totalAmount") AS revenue,
                COUNT(*)::integer AS invoice_count
            FROM "Invoice"
            WHERE "clientId" = ${clientId}
                AND "status" = 'PAID'
                AND "invoiceDate" >= CURRENT_DATE - INTERVAL '${months} months'
            GROUP BY EXTRACT(YEAR FROM "invoiceDate"), EXTRACT(MONTH FROM "invoiceDate"), TO_CHAR("invoiceDate", 'Month')
            ORDER BY EXTRACT(YEAR FROM "invoiceDate"), EXTRACT(MONTH FROM "invoiceDate");
        `;

    return clientRevenue;
  } catch (error) {
    errorHandler(error);
    throw error;
  }
};

export const getPaymentTrends = async () => {
  try {
    const paymentTrends = await prisma.$queryRaw<
      {
        month: string;
        year: number;
        avg_payment_days: number;
        on_time_payments: number;
        late_payments: number;
        payment_efficiency: number;
      }[]
    >`
            SELECT
                TO_CHAR("invoiceDate", 'Month') AS month,
                EXTRACT(YEAR FROM "invoiceDate") AS year,
                AVG(CASE WHEN "status" = 'PAID' 
                    THEN EXTRACT(EPOCH FROM ("updatedAt" - "invoiceDate")) / 86400 
                    ELSE NULL END) AS avg_payment_days,
                COUNT(CASE WHEN "status" = 'PAID' 
                    AND "updatedAt" <= "dueDate" THEN 1 END)::integer AS on_time_payments,
                COUNT(CASE WHEN "status" = 'PAID' 
                    AND "updatedAt" > "dueDate" THEN 1 END)::integer AS late_payments,
                CASE WHEN COUNT(*) > 0 THEN
                    (COUNT(CASE WHEN "status" = 'PAID' 
                        AND "updatedAt" <= "dueDate" THEN 1 END)::float / COUNT(*)::float) * 100
                ELSE 0 END AS payment_efficiency
            FROM "Invoice"
            WHERE "invoiceDate" >= CURRENT_DATE - INTERVAL '12 months'
            GROUP BY EXTRACT(YEAR FROM "invoiceDate"), EXTRACT(MONTH FROM "invoiceDate"), TO_CHAR("invoiceDate", 'Month')
            ORDER BY EXTRACT(YEAR FROM "invoiceDate"), EXTRACT(MONTH FROM "invoiceDate");
        `;

    return paymentTrends;
  } catch (error) {
    errorHandler(error);
    throw error;
  }
};
